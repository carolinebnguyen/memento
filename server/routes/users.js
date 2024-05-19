const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const upload = multer({ storage: multer.memoryStorage() });

const {
  CognitoIdentityProviderClient,
  AdminUpdateUserAttributesCommand,
} = require('@aws-sdk/client-cognito-identity-provider');

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient,
  UpdateCommand,
  GetCommand,
  QueryCommand,
  ScanCommand,
  TransactWriteCommand,
  BatchGetCommand,
  DeleteCommand,
  PutCommand,
} = require('@aws-sdk/lib-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { createNotification } = require('../utils/notificationUtils');

const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID;
const USER_TABLE = 'User';
const POST_TABLE = 'Post';
const NOTIFICATION_TABLE = 'Notification';

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
});

const dynamoDBClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
});
const docClient = DynamoDBDocumentClient.from(dynamoDBClient, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertEmptyValues: true,
  },
});

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
});

// GET api/users/:username
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

    const { Item: user } = await docClient.send(new GetCommand(userParams));

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { Items: posts } = await docClient.send(new QueryCommand(postParams));

    user.following = Array.from(user?.following || new Set());
    user.followers = Array.from(user?.followers || new Set());
    posts.forEach((post) => {
      post.likes = Array.from(post?.likes || new Set());
      post.profilePicture = user.picture;
    });

    const uniqueUsernames = new Set([...user.following, ...user.followers]);
    posts.forEach((post) => {
      post.likes.forEach((username) => {
        uniqueUsernames.add(username);
      });
    });

    const batchGetUserParams = {
      RequestItems: {
        [USER_TABLE]: {
          Keys: Array.from(uniqueUsernames).map((username) => ({
            username: username,
          })),
          ProjectionExpression: 'username, picture, #name',
          ExpressionAttributeNames: {
            '#name': 'name',
          },
        },
      },
    };

    if (uniqueUsernames.size > 0) {
      const { Responses } = await docClient.send(
        new BatchGetCommand(batchGetUserParams)
      );

      const userProfiles = Responses[USER_TABLE].reduce((acc, user) => {
        acc[user.username] = {
          picture: user.picture,
          name: user.name,
        };
        return acc;
      }, {});

      user.following = user.following.map((username) => ({
        username,
        picture: userProfiles[username].picture,
        name: userProfiles[username].name,
      }));

      user.followers = user.followers.map((username) => ({
        username,
        picture: userProfiles[username].picture,
        name: userProfiles[username].name,
      }));

      posts.forEach((post) => {
        post.likes = post.likes.map((username) => ({
          username,
          picture: userProfiles[username].picture,
          name: userProfiles[username].name,
        }));
      });
    }

    const result = {
      user,
      posts,
    };

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error getting user:', error);
    return res
      .status(500)
      .json({ error: 'Internal server error getting user' });
  }
});

// GET api/users/:username/info
router.get('/:username/info', async (req, res) => {
  try {
    const { username } = req.params;

    const params = {
      TableName: USER_TABLE,
      Key: {
        username: username,
      },
    };

    const { Item: user } = await docClient.send(new GetCommand(params));

    return res.status(200).json(user);
  } catch (error) {
    console.error('Error getting user: ', error);
    return res.status(500).json({ error: 'Inernal server error getting user' });
  }
});

// GET api/users/
router.get('/', async (req, res) => {
  try {
    const params = {
      TableName: USER_TABLE,
    };

    const { Items } = await docClient.send(new ScanCommand(params));

    return res.status(200).json(Items);
  } catch (error) {
    console.error('Error getting all users: ', error);
    return res
      .status(500)
      .json({ error: 'Internal server error getting all users' });
  }
});

// PUT api/users/account
router.put('/account', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User is not authenticated' });
  }

  try {
    const username = req.user.username;
    const { name, email, bio } = req.body;

    const checkEmailParams = {
      TableName: USER_TABLE,
      IndexName: 'email-index',
      KeyConditionExpression: 'email = :email',
      FilterExpression: 'username <> :username',
      ExpressionAttributeValues: {
        ':email': email,
        ':username': username,
      },
    };

    const { Items } = await docClient.send(new QueryCommand(checkEmailParams));

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

// PUT api/users/picture
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

// PUT api/users/:username/follow
router.put('/:username/follow', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User is not authenticated' });
  }

  try {
    const { username } = req.params;
    const follower = req.user.username;

    if (username === follower) {
      return res.status(409).json({ error: 'Users cannot follow themselves' });
    }

    const followParams = {
      TableName: USER_TABLE,
      Key: {
        username: username,
      },
      UpdateExpression: 'ADD followers :follower',
      ExpressionAttributeValues: {
        ':follower': new Set([follower]),
      },
      ConditionExpression: 'attribute_exists(username)',
    };

    const followingParams = {
      TableName: USER_TABLE,
      Key: {
        username: follower,
      },
      UpdateExpression: 'ADD following :username',
      ExpressionAttributeValues: {
        ':username': new Set([username]),
      },
      ConditionExpression: 'attribute_exists(username)',
    };

    const notification = {
      sender: follower,
      recipient: username,
      notificationType: 'follow',
    };

    const notificationParams = await createNotification(notification);

    const updateFollowers = new UpdateCommand(followParams);
    const updateFollowing = new UpdateCommand(followingParams);
    const putNotification = new PutCommand(notificationParams);

    const transactionParams = {
      TransactItems: [
        { Update: updateFollowers.input },
        { Update: updateFollowing.input },
        { Put: putNotification.input },
      ],
    };

    await docClient.send(new TransactWriteCommand(transactionParams));

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error following user: ', error);
    return res
      .status(500)
      .json({ error: 'Internal server error following user' });
  }
});

// DELETE api/users/:username/follow
router.delete('/:username/follow', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User is not authenticated' });
  }

  try {
    const { username } = req.params;
    const follower = req.user.username;

    if (username === follower) {
      return res
        .status(409)
        .json({ error: 'Users cannot unfollow themselves' });
    }

    const followParams = {
      TableName: USER_TABLE,
      Key: {
        username: username,
      },
      UpdateExpression: 'DELETE followers :follower',
      ExpressionAttributeValues: {
        ':follower': new Set([follower]),
      },
    };

    const followingParams = {
      TableName: USER_TABLE,
      Key: {
        username: follower,
      },
      UpdateExpression: 'DELETE following :username',
      ExpressionAttributeValues: {
        ':username': new Set([username]),
      },
    };

    const followNotificationParams = {
      TableName: NOTIFICATION_TABLE,
      KeyConditionExpression: 'recipient = :username',
      FilterExpression: 'sender = :follower AND notificationType = :type',
      ExpressionAttributeValues: {
        ':username': username,
        ':follower': follower,
        ':type': 'follow',
      },
    };

    const { Items } = await docClient.send(
      new QueryCommand(followNotificationParams)
    );

    if (!Items || Items.length === 0) {
      return res
        .status(404)
        .json({ error: 'Follow notification could not be found' });
    }

    const notificationToDelete = Items[0];
    const { notificationId } = notificationToDelete;

    const deleteParams = {
      TableName: NOTIFICATION_TABLE,
      Key: {
        recipient: username,
        notificationId: notificationId,
      },
    };

    const updateFollowers = new UpdateCommand(followParams);
    const updateFollowing = new UpdateCommand(followingParams);
    const deleteNotification = new DeleteCommand(deleteParams);

    const transactionParams = {
      TransactItems: [
        { Update: updateFollowers.input },
        { Update: updateFollowing.input },
        { Delete: deleteNotification.input },
      ],
    };

    await docClient.send(new TransactWriteCommand(transactionParams));
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error unfollowing user: ', error);
    return res
      .status(500)
      .json({ error: 'Internal server error unfollowing user' });
  }
});

module.exports = router;
