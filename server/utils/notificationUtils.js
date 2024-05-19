const crypto = require('crypto');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  GetCommand,
} = require('@aws-sdk/lib-dynamodb');

const NOTIFICATION_TABLE = 'Notification';
const POST_TABLE = 'Post';

const dynamoDBClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
});
const docClient = DynamoDBDocumentClient.from(dynamoDBClient);

const createNotification = async (notification) => {
  const { sender, recipient, postId, notificationType, commentId } =
    notification;

  if (sender === recipient) {
    throw new Error('Notification cannot be created by the post owner');
  }

  const notificationId = crypto.randomUUID();

  const notificationItem = {
    notificationId: notificationId,
    sender: sender,
    recipient: recipient,
    notificationType: notificationType,
    createdAt: new Date().toISOString(),
    status: 'UNREAD',
  };

  if (commentId) {
    notificationItem.commentId = commentId;
  }

  if (postId) {
    const postParams = {
      TableName: POST_TABLE,
      Key: {
        username: recipient,
        postId: postId,
      },
    };

    const { Item } = await docClient.send(new GetCommand(postParams));

    if (!Item) {
      return new Error('Post not found');
    }

    const { type } = Item;

    notificationItem.postId = postId;
    notificationItem.postType = type;
  }

  const notificationParams = {
    TableName: NOTIFICATION_TABLE,
    Item: notificationItem,
  };

  await docClient.send(new PutCommand(notificationParams));
  return { success: true, notificationId: notificationId };
};

module.exports = { createNotification };
