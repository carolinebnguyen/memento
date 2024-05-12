const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  SignUpCommand,
} = require('@aws-sdk/client-cognito-identity-provider');
const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');

const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID;
const COGNITO_CLIENT_SECRET = process.env.COGNITO_CLIENT_SECRET;
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
    const { AccessToken, IdToken, RefreshToken, ExpiresIn } =
      data.AuthenticationResult;

    return res.status(200).json({
      success: true,
      accessToken: AccessToken,
      idToken: IdToken,
      refreshToken: RefreshToken,
      expiresIn: ExpiresIn,
    });
  } catch (error) {
    console.error('Failed to login:', error);
    return res.status(500).json({ error: 'Incorrect username or password.' });
  }
});

const getSecretHash = (username) => {
  const concatenated = username + COGNITO_CLIENT_ID;
  const hash = crypto
    .createHmac('sha256', COGNITO_CLIENT_SECRET)
    .update(concatenated)
    .digest('base64');
  return hash;
};

module.exports = router;
