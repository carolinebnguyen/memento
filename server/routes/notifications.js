const express = require('express');
const router = express.Router();
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient,
  UpdateCommand,
  DeleteCommand,
  PutCommand,
  QueryCommand,
  GetCommand,
  BatchGetCommand,
} = require('@aws-sdk/lib-dynamodb');

const NOTIFICATION_TABLE = 'Notification';
const COMMENT_TABLE = 'Comment';
const USER_TABLE = 'User';
const POST_TABLE = 'Post';

const dynamoDBClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
});
const docClient = DynamoDBDocumentClient.from(dynamoDBClient);

// GET api/notifications/
router.get('/', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User is not authenticated' });
  }

  try {
    const username = req.user.username;

    const notificationParams = {
      TableName: NOTIFICATION_TABLE,
      KeyConditionExpression: 'recipient = :username',
      ExpressionAttributeValues: {
        ':username': username,
      },
    };

    const { Items: notifications } = await docClient.send(
      new QueryCommand(notificationParams)
    );

    const uniqueUsernames = new Set();
    notifications.forEach((notification) =>
      uniqueUsernames.add(notification.sender)
    );

    // get picture for each notification sender
    if (uniqueUsernames.size > 0) {
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

      const { Responses: users } = await docClient.send(
        new BatchGetCommand(batchGetUserParams)
      );
      const userProfiles = users[USER_TABLE].reduce((acc, user) => {
        acc[user.username] = {
          picture: user.picture,
          name: user.name,
        };
        return acc;
      }, {});

      notifications.forEach((notification) => {
        notification.sender = {
          username: notification.sender,
          picture: userProfiles[notification.sender].picture,
          name: userProfiles[notification.sender].name,
        };
      });
    }

    // get all postIds to perform batch get of post imageSrcs
    let postIds = new Set();
    notifications
      .filter((notification) => notification.postId)
      .forEach((notification) => {
        postIds.add(notification.postId);
      });

    let posts = [];

    if (postIds.size > 0) {
      const batchGetPostParams = {
        RequestItems: {
          [POST_TABLE]: {
            Keys: Array.from(postIds).map((postId) => ({
              username: username,
              postId: postId,
            })),
          },
        },
      };

      const { Responses } = await docClient.send(
        new BatchGetCommand(batchGetPostParams)
      );

      posts = Responses[POST_TABLE];
    }

    const postMap = posts.reduce((acc, post) => {
      acc[post.postId] = {
        imageSrc: post.imageSrc,
        type: post.type,
        text: post.text,
      };
      return acc;
    }, {});

    // get all commentIds to perform batch get of comments
    const commentIds = notifications
      .filter((notification) => notification.commentId)
      .map((notification) => ({ commentId: notification.commentId }));

    let comments = [];

    if (commentIds.length > 0) {
      const batchGetCommentParams = {
        RequestItems: {
          [COMMENT_TABLE]: {
            Keys: commentIds,
          },
        },
      };

      const { Responses } = await docClient.send(
        new BatchGetCommand(batchGetCommentParams)
      );

      comments = Responses[COMMENT_TABLE];
    }

    const commentMap = comments.reduce((acc, comment) => {
      acc[comment.commentId] = comment.text;
      return acc;
    }, {});

    const detailedNotifications = notifications.map((notification) => {
      if (notification.commentId && commentMap[notification.commentId]) {
        notification.commentContent = commentMap[notification.commentId];
      }
      if (notification.postId && postMap[notification.postId]) {
        notification.postImage = postMap[notification.postId].imageSrc;
        notification.postType = postMap[notification.postId].type;
      }
      if (
        notification.postType === 'status' &&
        notification.notificationType === 'like'
      ) {
        notification.statusContent = postMap[notification.postId].text;
      }
      return notification;
    });

    return res.status(200).json(detailedNotifications);
  } catch (error) {
    console.error('Error getting notifications: ', error);
    return res
      .status(500)
      .json({ error: 'Internal server error getting notifications' });
  }
});

module.exports = router;
