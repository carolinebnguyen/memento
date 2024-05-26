const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');
const upload = multer({ storage: multer.memoryStorage() });

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient,
  UpdateCommand,
  DeleteCommand,
  PutCommand,
  QueryCommand,
  GetCommand,
  BatchGetCommand,
  TransactWriteCommand,
} = require('@aws-sdk/lib-dynamodb');

const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require('@aws-sdk/client-s3');
const { createNotification } = require('../utils/notificationUtils');

const USER_TABLE = 'User';
const POST_TABLE = 'Post';
const COMMENT_TABLE = 'Comment';
const NOTIFICATION_TABLE = 'Notification';

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

// GET api/posts/:postId
router.get('/:postId', async (req, res) => {
  const { postId } = req.params;

  if (!postId) {
    return res.status(400).json({ error: 'PostId is required' });
  }

  try {
    const postParams = {
      TableName: POST_TABLE,
      IndexName: 'postId-index',
      KeyConditionExpression: 'postId = :postId',
      ExpressionAttributeValues: {
        ':postId': postId,
      },
    };

    const { Items } = await docClient.send(new QueryCommand(postParams));

    if (!Items || Items.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const post = Items[0];
    post.likes = Array.from(post?.likes || new Set());

    const commentParams = {
      TableName: COMMENT_TABLE,
      IndexName: 'postId-index',
      KeyConditionExpression: 'postId = :postId',
      ExpressionAttributeValues: {
        ':postId': postId,
      },
    };

    const { Items: commentItems } = await docClient.send(
      new QueryCommand(commentParams)
    );

    let comments = commentItems;

    const uniqueUsernames = new Set();

    if (post.likes && post.likes.length > 0) {
      post.likes.forEach((username) => {
        uniqueUsernames.add(username);
      });
    }

    comments.forEach((comment) => {
      uniqueUsernames.add(comment.username);
    });

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

      post.likes = post.likes.map((username) => ({
        username,
        picture: userProfiles[username].picture,
        name: userProfiles[username].name,
      }));

      comments = Object.values(comments).map((comment) => ({
        ...comment,
        username: comment.username,
        picture: userProfiles[comment.username].picture,
        name: userProfiles[comment.username].name,
      }));
    }

    const userParams = {
      TableName: USER_TABLE,
      Key: {
        username: post.username,
      },
    };

    const { Item: user } = await docClient.send(new GetCommand(userParams));

    post.profilePicture = user.picture;
    post.comments = comments;

    return res.status(200).json(post);
  } catch (error) {
    console.error('Error getting post:', error);
    return res
      .status(500)
      .json({ error: 'Internal server error getting post' });
  }
});

// GET api/posts/
router.get('/', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User is not authenticated' });
  }

  async function getAllPosts(usernames) {
    const postPromises = usernames.map((username) =>
      docClient.send(
        new QueryCommand({
          TableName: POST_TABLE,
          KeyConditionExpression: 'username = :username',
          ExpressionAttributeValues: {
            ':username': username.toLowerCase(),
          },
        })
      )
    );

    const postsByUser = await Promise.all(postPromises);
    const posts = postsByUser.flatMap((postData) => postData.Items);

    const uniqueUsernames = new Set();
    posts.forEach((post) => {
      (post.likes || new Set()).forEach((username) =>
        uniqueUsernames.add(username)
      );
      uniqueUsernames.add(post.username);
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

      posts.forEach((post) => {
        post.likes = Array.from(post?.likes || new Set());
        if (post.likes.length > 0) {
          post.likes = post.likes.map((username) => ({
            username,
            picture: userProfiles[username].picture,
            name: userProfiles[username].name,
          }));
        }
        post.profilePicture = userProfiles[post.username]?.picture;
      });
    }

    return posts;
  }

  try {
    const username = req.user.username;

    // get user to get their following list
    const getUserParams = {
      TableName: USER_TABLE,
      Key: {
        username: username.toLowerCase(),
      },
    };
    const { Item: user } = await docClient.send(new GetCommand(getUserParams));
    user.following = Array.from(user?.following || new Set());
    user.following = [...user.following, username];

    const posts = await getAllPosts(user.following);

    return res.status(200).json(posts);
  } catch (error) {
    console.error('Error getting posts:', error);
    return res
      .status(500)
      .json({ error: 'Internal server error getting posts' });
  }
});

// POST api/posts/
router.post('/', upload.single('file'), async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User is not authenticated' });
  }

  try {
    const username = req.user.username;
    let imageSrc = '';

    // postId and photoName will share UUID
    const postUUID = crypto.randomUUID();

    const { type, text } = req.body;

    if (req.file) {
      const fileData = req.file.buffer;
      const extension = path.extname(req.file.originalname).toLowerCase();

      const photoName = `${postUUID}${extension}`;

      const contentType = `image/${extension.slice(1)}`;

      const s3Params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: photoName,
        Body: fileData,
        ACL: 'public-read',
        ContentType: contentType,
      };

      await s3Client.send(new PutObjectCommand(s3Params));

      imageSrc = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${photoName}`;
    }

    const dynamoParams = {
      TableName: POST_TABLE,
      Item: {
        postId: postUUID,
        username: username,
        type: type,
        imageSrc: imageSrc,
        text: text.trim(),
        postedAt: new Date().toISOString(),
        commentCount: 0,
      },
    };

    await docClient.send(new PutCommand(dynamoParams));

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error creating post: ', error);
    return res
      .status(500)
      .json({ error: 'Internal server error creating post' });
  }
});

// PUT api/posts/:postId
router.put('/:postId', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User is not authenticated' });
  }

  try {
    const username = req.user.username;
    const { postId } = req.params;
    const { text } = req.body;

    const checkPost = {
      TableName: POST_TABLE,
      Key: {
        username: username,
        postId: postId,
      },
    };

    const { Item } = await docClient.send(new GetCommand(checkPost));

    if (!Item) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (Item.username !== username) {
      return res
        .status(403)
        .json({ error: 'User is not authorized to delete this post' });
    }

    const dynamoParams = {
      TableName: POST_TABLE,
      Key: {
        username: username,
        postId: postId,
      },
      UpdateExpression: 'set #text = :text',
      ExpressionAttributeNames: {
        '#text': 'text',
      },
      ExpressionAttributeValues: {
        ':text': text.trim(),
      },
    };

    await docClient.send(new UpdateCommand(dynamoParams));

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating post: ', error);
    return res
      .status(500)
      .json({ error: 'Internal server error updating post' });
  }
});

// PUT api/posts/:postId/like
router.put('/:postId/like', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User is not authenticated' });
  }

  try {
    const username = req.user.username;
    const { postId } = req.params;

    const getPostParams = {
      TableName: POST_TABLE,
      IndexName: 'postId-index',
      KeyConditionExpression: 'postId = :postId',
      ExpressionAttributeValues: {
        ':postId': postId,
      },
    };

    const { Items } = await docClient.send(new QueryCommand(getPostParams));

    if (!Items || Items.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const post = Items[0];
    const { username: poster } = post;

    const likeParams = {
      TableName: POST_TABLE,
      Key: {
        username: poster,
        postId: postId,
      },
      UpdateExpression: 'ADD likes :username',
      ExpressionAttributeValues: {
        ':username': new Set([username]),
      },
      ConditionExpression: 'attribute_exists(username)',
    };

    const updateLikes = new UpdateCommand(likeParams);

    const transactionItems = [{ Update: updateLikes.input }];

    if (username !== poster) {
      const notification = {
        sender: username,
        recipient: poster,
        notificationType: 'like',
        postId: postId,
      };

      const notificationParams = await createNotification(notification);

      const putNotification = new PutCommand(notificationParams);
      transactionItems.push({ Put: putNotification.input });
    }

    const transactionParams = {
      TransactItems: transactionItems,
    };

    await docClient.send(new TransactWriteCommand(transactionParams));

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error liking post: ', error);
    return res.status(500).json({ error: 'Internal server error liking post' });
  }
});

// DELETE api/posts/:postId/like
router.delete('/:postId/like', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User is not authenticated' });
  }

  try {
    const username = req.user.username;
    const { postId } = req.params;

    const getPostParams = {
      TableName: POST_TABLE,
      IndexName: 'postId-index',
      KeyConditionExpression: 'postId = :postId',
      ExpressionAttributeValues: {
        ':postId': postId,
      },
    };

    const { Items } = await docClient.send(new QueryCommand(getPostParams));

    if (!Items || Items.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const post = Items[0];
    const { username: poster } = post;

    const likeParams = {
      TableName: POST_TABLE,
      Key: {
        username: poster,
        postId: postId,
      },
      UpdateExpression: 'DELETE likes :username',
      ExpressionAttributeValues: {
        ':username': new Set([username]),
      },
    };

    const likeNotificationParams = {
      TableName: NOTIFICATION_TABLE,
      KeyConditionExpression: 'recipient = :poster',
      FilterExpression: 'sender = :username AND notificationType = :type',
      ExpressionAttributeValues: {
        ':username': username,
        ':poster': poster,
        ':type': 'like',
      },
    };

    const { Items: notifications } = await docClient.send(
      new QueryCommand(likeNotificationParams)
    );

    const updateLikes = new UpdateCommand(likeParams);

    const transactionItems = [{ Update: updateLikes.input }];

    if (notifications && notifications.length > 0) {
      const notificationToDelete = notifications[0];
      const { notificationId } = notificationToDelete;

      const deleteParams = {
        TableName: NOTIFICATION_TABLE,
        Key: {
          recipient: poster,
          notificationId: notificationId,
        },
      };

      const deleteNotification = new DeleteCommand(deleteParams);
      transactionItems.push({ Delete: deleteNotification.input });
    }

    const transactionParams = {
      TransactItems: transactionItems,
    };

    await docClient.send(new TransactWriteCommand(transactionParams));

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error unliking post: ', error);
    return res
      .status(500)
      .json({ error: 'Internal server error unliking post' });
  }
});

// DELETE api/posts/:postId
router.delete('/:postId', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User is not authenticated' });
  }

  try {
    const username = req.user.username;
    const { postId } = req.params;

    const checkPost = {
      TableName: POST_TABLE,
      Key: {
        username: username,
        postId: postId,
      },
    };

    const { Item } = await docClient.send(new GetCommand(checkPost));

    if (!Item) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const { imageSrc } = Item;

    if (Item.username !== username) {
      return res
        .status(403)
        .json({ error: 'User is not authorized to delete this post' });
    }

    const postParams = {
      Delete: {
        TableName: POST_TABLE,
        Key: {
          username: username,
          postId: postId,
        },
      },
    };

    const commentParams = {
      TableName: COMMENT_TABLE,
      IndexName: 'postId-index',
      KeyConditionExpression: 'postId = :postId',
      ExpressionAttributeValues: {
        ':postId': postId,
      },
    };

    const { Items: comments } = await docClient.send(
      new QueryCommand(commentParams)
    );

    const commentDeletes = comments.map((comment) => ({
      Delete: {
        TableName: COMMENT_TABLE,
        Key: {
          commentId: comment.commentId,
        },
      },
    }));

    const notificationParams = {
      TableName: NOTIFICATION_TABLE,
      IndexName: 'postId-index',
      KeyConditionExpression: 'postId = :postId',
      ExpressionAttributeValues: {
        ':postId': postId,
      },
    };

    const { Items: notifications } = await docClient.send(
      new QueryCommand(notificationParams)
    );

    const notificationDeletes = notifications.map((notification) => ({
      Delete: {
        TableName: NOTIFICATION_TABLE,
        Key: {
          recipient: username,
          notificationId: notification.notificationId,
        },
      },
    }));

    const transactionParams = {
      TransactItems: [postParams, ...commentDeletes, ...notificationDeletes],
    };

    await docClient.send(new TransactWriteCommand(transactionParams));

    if (imageSrc) {
      const s3Key = imageSrc.substring(imageSrc.lastIndexOf('/') + 1);

      const s3Params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: s3Key,
      };

      await s3Client.send(new DeleteObjectCommand(s3Params));
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting post: ', error);
    return res
      .status(500)
      .json({ error: 'Internal server error deleting post' });
  }
});

module.exports = router;
