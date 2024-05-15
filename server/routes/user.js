const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const upload = multer({ storage: multer.memoryStorage() });

const {
  CognitoIdentityProviderClient,
  AdminUpdateUserAttributesCommand,
} = require('@aws-sdk/client-cognito-identity-provider');
const { DynamoDBClient, GetItemCommand } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient,
  UpdateCommand,
  GetCommand,
  QueryCommand,
} = require('@aws-sdk/lib-dynamodb');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID;
const USER_TABLE = 'User';
const POST_TABLE = 'Post';

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
});

const dynamoDBClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
});
const docClient = DynamoDBDocumentClient.from(dynamoDBClient);

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
});

// GET api/user/:username
router.get('/:username', async (req, res) => {
  const { username } = req.params;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    const userParams = {
      TableName: USER_TABLE,
      Key: {
        username: username.toLowerCase(),
      },
    };

    const postParams = {
      TableName: POST_TABLE,
      KeyConditionExpression: 'username = :username',
      ExpressionAttributeValues: {
        ':username': username.toLowerCase(),
      },
    };

    const { Item } = await docClient.send(new GetCommand(userParams));

    if (!Item) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { Items } = await docClient.send(new QueryCommand(postParams));

    const result = {
      user: Item,
      posts: Items,
    };

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error getting user:', error);
    return res
      .status(500)
      .json({ error: 'Internal server error getting user' });
  }
});

// PUT api/user/account
router.put('/account', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User is not authenticated' });
  }

  try {
    const username = req.user.username;
    const { name, email, bio } = req.body;

    const checkEmail = {
      TableName: USER_TABLE,
      IndexName: 'email-index',
      KeyConditionExpression: 'email = :email',
      FilterExpression: 'username <> :username',
      ExpressionAttributeValues: {
        ':email': { S: email },
        ':username': { S: username },
      },
    };

    const { Items } = await dynamoDBClient.send(new QueryCommand(checkEmail));

    if (Items && Items.length > 0) {
      return res.status(409).json({ error: 'Email is already in use' });
    }

    const cognitoParams = {
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: username,
      UserAttributes: [
        {
          Name: 'email',
          Value: email,
        },
        {
          Name: 'name',
          Value: name,
        },
      ],
    };

    const cognitoCommand = new AdminUpdateUserAttributesCommand(cognitoParams);
    await cognitoClient.send(cognitoCommand);

    const dynamoParams = {
      TableName: USER_TABLE,
      Key: { username: username },
      UpdateExpression: 'set email = :email, #name = :name, bio = :bio',
      ExpressionAttributeValues: {
        ':email': email,
        ':name': name,
        ':bio': bio.trim(),
      },
      ExpressionAttributeNames: {
        '#name': 'name',
      },
      ReturnValues: 'UPDATED_NEW',
    };

    const dynamoCommand = new UpdateCommand(dynamoParams);
    const data = await docClient.send(dynamoCommand);

    return res.status(200).json({ data: data.Attributes });
  } catch (error) {
    console.error('Error updating user: ', error);
    return res
      .status(500)
      .json({ error: 'Internal server error updating user' });
  }
});

// PUT api/user/picture
router.put('/picture', upload.single('file'), async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User is not authenticated' });
  }

  try {
    const username = req.user.username;

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileData = req.file.buffer;
    const extension = path.extname(req.file.originalname).toLowerCase();

    // upload picture to S3 first
    const photoName = `${username.toLowerCase()}ProfilePicture${extension}`;

    const s3Params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: photoName,
      Body: fileData,
      ACL: 'public-read',
    };

    const s3Command = new PutObjectCommand(s3Params);
    await s3Client.send(s3Command);

    const photoURL = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${photoName}`;

    const dynamoParams = {
      TableName: USER_TABLE,
      Key: {
        username: username.toLowerCase(),
      },
      UpdateExpression: 'set picture = :url',
      ExpressionAttributeValues: {
        ':url': photoURL,
      },
      ReturnValues: 'UPDATED_NEW',
    };

    const dynamoCommand = new UpdateCommand(dynamoParams);
    const data = await docClient.send(dynamoCommand);

    return res.status(200).json({ picture: data.Attributes.picture });
  } catch (error) {
    console.error('Error updating user: ', error);
    return res
      .status(500)
      .json({ error: 'Internal server error updating user' });
  }
});

module.exports = router;
