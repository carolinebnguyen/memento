const {
  CognitoIdentityProviderClient,
  GetUserCommand,
  InitiateAuthCommand,
} = require('@aws-sdk/client-cognito-identity-provider');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID;
const COGNITO_CLIENT_SECRET = process.env.COGNITO_CLIENT_SECRET;

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
});

const verifyAccessToken = async (req, res, next) => {
  if (req.path.startsWith('/api/auth')) {
    return next();
  }

  let accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return res
      .status(401)
      .json({
        success: false,
        redirectToLogin: true,
        message: 'No access token provided',
      });
  }

  try {
    if (isAccessTokenExpired(accessToken)) {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          redirectToLogin: true,
          message: 'Access token is expired and no refresh token provided',
        });
      }
      accessToken = await refreshAccessToken(accessToken, refreshToken);
      res.cookie('accessToken', accessToken, { httpOnly: true, secure: false });
    }

    const response = await cognitoClient.send(
      new GetUserCommand({
        AccessToken: accessToken,
      })
    );
    req.user = {
      username: response.Username,
    };
    response.UserAttributes.forEach((attr) => {
      req.user[attr.Name] = attr.Value;
    });
    next();
  } catch (error) {
    console.error('Error verifying access token:', error);
    return res
      .status(401)
      .json({ success: false, message: 'Invalid access token' });
  }
};

const isAccessTokenExpired = (accessToken) => {
  const decodedAccessToken = jwt.decode(accessToken);
  const currentTimestamp = Math.floor(Date.now() / 1000);
  return decodedAccessToken.exp < currentTimestamp;
};

const refreshAccessToken = async (accessToken, refreshToken) => {
  try {
    const decodedAccessToken = jwt.decode(accessToken);
    const response = await cognitoClient.send(
      new InitiateAuthCommand({
        ClientId: COGNITO_CLIENT_ID,
        AuthFlow: 'REFRESH_TOKEN_AUTH',
        AuthParameters: {
          REFRESH_TOKEN: refreshToken,
          SECRET_HASH: getSecretHash(decodedAccessToken.username),
        },
      })
    );
    return response.AuthenticationResult.AccessToken;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error;
  }
};

const getSecretHash = (username) => {
  const concatenated = username + COGNITO_CLIENT_ID;
  const hash = crypto
    .createHmac('sha256', COGNITO_CLIENT_SECRET)
    .update(concatenated)
    .digest('base64');
  return hash;
};

module.exports = { verifyAccessToken, getSecretHash };
