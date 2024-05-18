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
  BatchGetCommand,
  TransactWriteCommand,
} = require('@aws-sdk/lib-dynamodb');

const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require('@aws-sdk/client-s3');

const USER_TABLE = 'User';
const POST_TABLE = 'Post';
const COMMENT_TABLE = 'Comment';

const dynamoDBClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
});
const docClient = DynamoDBDocumentClient.from(dynamoDBClient, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertEmptyValues: true,
  },
});

// GET api/comments/:postId
router.get('/', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User is not authenticated' });
  }

  try {
    const username = req.user.username;
    const { postId } = req.params;

    const commentsByPostIdParams = {
      TableName: COMMENT_TABLE,
      IndexName: 'postId-index',
      KeyConditionExpression: 'postId = :postId',
      ExpressionAttributeValues: {
        ':postId': postId,
      },
    };

    const { Items } = await docClient.send(
      new QueryCommand(commentsByPostIdParams)
    );

    if (!Items || Items.length === 0) {
      return res.status(200).json([]);
    }

    return res.status(200).json(Items);
  } catch (error) {
    console.error('Error getting comments: ', error);
    return res
      .status(500)
      .json({ error: 'Internal server error getting comments' });
  }
});

// POST api/comments
router.post('/', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User is not authenticated' });
  }

  try {
    const username = req.user.username;
    const { text, postId, poster } = req.body;

    const commentId = crypto.randomUUID();

    const commentParams = {
      TableName: COMMENT_TABLE,
      Item: {
        commentId: commentId,
        postId: postId,
        text: text,
        username: username,
        postedAt: new Date().toISOString(),
      },
    };

    const postParams = {
      TableName: POST_TABLE,
      Key: {
        username: poster,
        postId: postId,
      },
      UpdateExpression:
        'SET #commentCount = if_not_exists(#commentCount, :zero) + :inc',
      ExpressionAttributeNames: {
        '#commentCount': 'commentCount',
      },
      ExpressionAttributeValues: {
        ':inc': 1,
        ':zero': 0,
      },
    };

    const postComment = new PutCommand(commentParams);
    const updateCommentCount = new UpdateCommand(postParams);

    const transactionParams = {
      TransactItems: [
        { Put: postComment.input },
        { Update: updateCommentCount.input },
      ],
    };

    await docClient.send(new TransactWriteCommand(transactionParams));

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error creating comment: ', error);
    return res
      .status(500)
      .json({ error: 'Internal server error creating comment' });
  }
});

// PUT api/comments/:commentId
router.put('/:commentId', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User is not authenticated' });
  }
  try {
    const username = req.user.username;
    const { commentId } = req.params;
    const { text } = req.body;

    const checkComment = {
      TableName: COMMENT_TABLE,
      Key: {
        commentId: commentId,
      },
    };

    const { Item } = await docClient.send(new GetCommand(checkComment));

    if (!Item) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (Item.username !== username) {
      return res
        .status(403)
        .json({ error: 'User is not authorized to update this comment' });
    }

    const commentParams = {
      TableName: COMMENT_TABLE,
      Key: {
        commentId: commentId,
      },
      UpdateExpression: 'set #text = :text',
      ExpressionAttributeNames: {
        '#text': 'text',
      },
      ExpressionAttributeValues: {
        ':text': text,
      },
    };

    await docClient.send(new UpdateCommand(commentParams));

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating comment: ', error);
    return res
      .status(500)
      .json({ error: 'Internal server error updating comment' });
  }
});

// DELETE api/comments/:commentId
router.delete('/:commentId', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User is not authenticated' });
  }
  try {
    const username = req.user.username;
    const { commentId } = req.params;

    const checkComment = {
      TableName: COMMENT_TABLE,
      Key: {
        commentId: commentId,
      },
    };

    const { Item } = await docClient.send(new GetCommand(checkComment));

    if (!Item) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const { postId } = Item;

    const commentParams = {
      TableName: COMMENT_TABLE,
      Key: {
        commentId: commentId,
      },
    };

    const deleteComment = new DeleteCommand(commentParams);

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

    const updatePostParams = {
      TableName: POST_TABLE,
      Key: {
        username: post.username,
        postId: postId,
      },
      UpdateExpression: 'SET #commentCount = #commentCount - :dec',
      ExpressionAttributeNames: {
        '#commentCount': 'commentCount',
      },
      ExpressionAttributeValues: {
        ':dec': 1,
      },
    };

    const updateCommentCount = new UpdateCommand(updatePostParams);

    const transactionParams = {
      TransactItems: [
        { Delete: deleteComment.input },
        { Update: updateCommentCount.input },
      ],
    };

    await docClient.send(new TransactWriteCommand(transactionParams));

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting comment: ', error);
    return res
      .status(500)
      .json({ error: 'Internal server error deleting comment' });
  }
});

module.exports = router;
