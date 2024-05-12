const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const {
  CognitoIdentityProviderClient,
  SignUpCommand,
} = require('@aws-sdk/client-cognito-identity-provider');
const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');

const USER_TABLE = 'User';

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
});
const dynamoDBClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
});

// GET /api/user/
router.get('/', async (req, res) => {
  return;
});

// POST /api/user/signup
router.post('/signup', async (req, res) => {
  try {
    const { username, password, email, name } = req.body;

    if (!username || !password || !email || !name) {
      return res.status(400).json({
        error: 'Username, password, email, and name are required',
      });
    }

    const signUpParams = {
      ClientId: process.env.COGNITO_CLIENT_ID,
      SecretHash: getSecretHash(username),
      Username: username,
      Password: password,
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
    await cognitoClient.send(new SignUpCommand(signUpParams));

    const userParams = {
      TableName: USER_TABLE,
      Item: {
        username: { S: username },
        email: { S: email },
        name: { S: name },
        picture: { S: '' },
        bio: { S: '' },
        followersList: { L: [] },
        followingList: { L: [] },
      },
      ConditionExpression: 'attribute_not_exists(username)',
    };
    await dynamoDBClient.send(new PutItemCommand(userParams));

    res.status(201).json({ message: 'User account created successfully!' });
  } catch (error) {
    if (
      error.name === 'UsernameExistsException' ||
      error.__type.includes('ConditionalCheckFailedException')
    ) {
      return res.status(409).json({ error: 'Username already exists.' });
    }

    console.error('Error creating user account:', error);
    res.status(500).json({ error: 'Failed to create user account.' });
  }
});

const getSecretHash = (username) => {
  const clientId = process.env.COGNITO_CLIENT_ID;
  const clientSecret = process.env.COGNITO_CLIENT_SECRET;

  const concatenated = username + clientId;
  const hash = crypto
    .createHmac('sha256', clientSecret)
    .update(concatenated)
    .digest('base64');
  return hash;
};

module.exports = router;
