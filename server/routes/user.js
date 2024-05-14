const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');
const upload = multer({ storage: multer.memoryStorage() });

const {
  CognitoIdentityProviderClient,
} = require('@aws-sdk/client-cognito-identity-provider');
const {
  DynamoDBClient,
  GetItemCommand,
  QueryCommand,
} = require('@aws-sdk/client-dynamodb');
const { unmarshall } = require('@aws-sdk/util-dynamodb');
const {
  DynamoDBDocumentClient,
  UpdateCommand,
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

// GET api/user/
router.get('/', async (req, res) => {
  const username = req.query.username || req.user.username;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  const userParams = {
    TableName: USER_TABLE,
    Key: {
      username: { S: username.toLowerCase() },
    },
  };

  const postParams = {
    TableName: POST_TABLE,
    KeyConditionExpression: 'username = :username',
    ExpressionAttributeValues: {
      ':username': { S: username.toLowerCase() },
    },
  };

  try {
    const { Item: userItem } = await dynamoDBClient.send(
      new GetItemCommand(userParams)
    );
    if (!userItem) {
      return res.status(404).json({ error: 'User not found' });
    }
    const { Items: postItems } = await dynamoDBClient.send(
      new QueryCommand(postParams)
    );

    const result = {
      user: unmarshall(userItem),
      posts: postItems.map((item) => unmarshall(item)),
    };

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error getting user:', error);
    return res
      .status(500)
      .json({ error: 'Internal server error getting user' });
  }
});

// GET api/user/current
router.get('/current', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User is not authenticated' });
  }

  const username = req.user.username;

  return res.status(200).json({ username: username });
});

// PUT api/user/account
router.put('/account', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User is not authenticated' });
  }

  try {
    const { name, email, bio } = req.body;

    return res.status(200).json({});
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
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileData = req.file.buffer;
    const extension = path.extname(req.file.originalname).toLowerCase();

    // upload picture to S3 first
    const rawBytes = await crypto.randomBytes(16);
    const photoName = `${rawBytes.toString('hex')}${extension}`;

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
        username: req.user.username,
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
