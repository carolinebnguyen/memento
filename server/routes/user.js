const express = require('express');
const router = express.Router();
const { DynamoDBClient, GetItemCommand } = require('@aws-sdk/client-dynamodb');
const { unmarshall } = require('@aws-sdk/util-dynamodb');

const USER_TABLE = 'User';
const dynamoDBClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
});

// GET api/user/
router.get('/', async (req, res) => {
  const username = req.query.username || req.user.username;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  const params = {
    TableName: USER_TABLE,
    Key: {
      username: { S: username.toLowerCase() },
    },
  };

  try {
    const { Item: userItem } = await dynamoDBClient.send(
      new GetItemCommand(params)
    );
    if (!userItem) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json(unmarshall(userItem));
  } catch (error) {
    console.error('Error getting user:', error);
    return res
      .status(500)
      .json({ error: 'Internal server error getting user' });
  }
});

module.exports = router;
