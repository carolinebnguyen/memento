const express = require('express');
const router = express.Router();
const {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  GlobalSignOutCommand,
  SignUpCommand,
} = require('@aws-sdk/client-cognito-identity-provider');
const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');
const { getSecretHash } = require('../utils/authUtils');

const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID;
const USER_TABLE = 'User';

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
});
const dynamoDBClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
});

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { username, password, email, name } = req.body;

    if (!username || !password || !email || !name) {
      return res.status(400).json({
        error: 'Username, password, email, and name are required',
      });
    }

    const signUpParams = {
      ClientId: COGNITO_CLIENT_ID,
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
      Item: marshall({
        username,
        email,
        name,
        picture: '',
        bio: '',
        followersList: [],
        followingList: [],
      }),
      ConditionExpression: 'attribute_not_exists(username)',
    };
    await dynamoDBClient.send(new PutItemCommand(userParams));

    return res
      .status(201)
      .json({ message: 'User account created successfully!' });
  } catch (error) {
    if (
      error.name === 'UsernameExistsException' ||
      error.__type.includes('ConditionalCheckFailedException')
    ) {
      return res.status(409).json({ error: 'Username already exists.' });
    }

    console.error('Error creating user account:', error);
    return res.status(500).json({ error: 'Failed to create user account.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const params = {
      ClientId: COGNITO_CLIENT_ID,
      AuthFlow: 'USER_PASSWORD_AUTH',
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
        SECRET_HASH: getSecretHash(username),
      },
    };
    const data = await cognitoClient.send(new InitiateAuthCommand(params));
    const { AccessToken, RefreshToken } = data.AuthenticationResult;

    // Update secure to true if https enabled
    res.cookie('accessToken', AccessToken, { httpOnly: true, secure: false });
    res.cookie('refreshToken', RefreshToken, { httpOnly: true, secure: false });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Failed to login:', error);
    return res.status(500).json({ error: 'Incorrect username or password.' });
  }
});

// POST /api/auth/logout
router.post('/logout', async (req, res) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    return res.status(401).json({
      success: false,
      redirectToLogin: true,
      error: 'No access token provided for logout',
    });
  }

  try {
    await cognitoClient.send(
      new GlobalSignOutCommand({
        AccessToken: accessToken,
      })
    );

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(200).json({ success: true, message: 'Logout successful' });
  } catch (error) {
    console.error('Error logging out:', error);
    res.status(500).json({ success: false, message: 'Failed to logout' });
  }
});

module.exports = router;
