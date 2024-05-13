const express = require('express');
const router = express.Router();
const {
  DynamoDBClient,
  GetItemCommand,
  QueryCommand,
} = require('@aws-sdk/client-dynamodb');
const { unmarshall } = require('@aws-sdk/util-dynamodb');

const USER_TABLE = 'User';
const POST_TABLE = 'Post';

const dynamoDBClient = new DynamoDBClient({
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

module.exports = router;
