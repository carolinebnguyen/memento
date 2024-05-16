const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient,
  UpdateCommand,
  DeleteCommand,
  PutCommand,
  QueryCommand,
  GetCommand,
} = require('@aws-sdk/lib-dynamodb');

const NOTIFICATION_TABLE = 'Notification';

const dynamoDBClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
});
const docClient = DynamoDBDocumentClient.from(dynamoDBClient);

// GET api/notification/
router.get('/', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User is not authenticated' });
  }

  try {
    const username = req.user.username;

    const params = {
      TableName: NOTIFICATION_TABLE,
      KeyConditionExpression: 'recipientId = :recipientId',
      ExpressionAttributeValues: {
        ':recipientId': recipientId,
      },
    };

    const { Items } = await docClient.send(new QueryCommand(params));
    return Items;
  } catch (error) {
    console.error('Error getting notifications: ', error);
    return res
      .status(500)
      .json({ error: 'Internal server error getting notifications' });
  }
});

// POST api/notification/
router.post('/', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User is not authenticated' });
  }

  try {
    const senderId = req.user.username;
    const { recipientId, postId, notificationType, commentId, commentContent } =
      req.body;

    if (senderId === recipientId) {
      return res
        .status(409)
        .json({ error: 'Notification cannot be created by the post owner' });
    }

    const postParams = {
      TableName: POST_TABLE,
      Key: {
        username: recipientId,
        postId: postId,
      },
    };

    const { Item } = await docClient.send(new GetCommand(postParams));

    if (!Item) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const notificationId = crypto.randomUUID();
    const { type } = Item;

    const notificationItem = {
      notificationId: notificationId,
      senderId: senderId,
      recipientId: recipientId,
      postId: postId,
      postType: type,
      notificationType: notificationType,
      createdAt: new Date().toISOString(),
    };

    if (commentId && commentContent) {
      notificationItem.commentId = commentId;
      notificationItem.commentContent = commentContent;
    }

    const notificationParams = {
      TableName: NOTIFICATION_TABLE,
      Item: notificationItem,
    };

    await docClient.send(new PutCommand(notificationParams));
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error creating notification: ', error);
    return res
      .status(500)
      .json({ error: 'Internal server error creating notification' });
  }
});

module.exports = router;
