const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');
const upload = multer({ storage: multer.memoryStorage() });

const { DynamoDBClient, GetItemCommand } = require('@aws-sdk/client-dynamodb');
const { unmarshall } = require('@aws-sdk/util-dynamodb');
const {
  DynamoDBDocumentClient,
  UpdateCommand,
  DeleteCommand,
  PutCommand,
  QueryCommand,
} = require('@aws-sdk/lib-dynamodb');

const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require('@aws-sdk/client-s3');

const POST_TABLE = 'Post';

const dynamoDBClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
});
const docClient = DynamoDBDocumentClient.from(dynamoDBClient);

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
});

// GET api/post/
router.get('/:postId', async (req, res) => {
  const { postId } = req.params;

  if (!postId) {
    return res.status(400).json({ error: 'PostID is required' });
  }

  try {
    const dynamoParams = {
      TableName: POST_TABLE,
      IndexName: 'postId-index',
      KeyConditionExpression: 'postId = :postId',
      ExpressionAttributeValues: {
        ':postId': postId,
      },
    };

    const { Items } = await docClient.send(new QueryCommand(dynamoParams));

    if (!Items || Items.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    return res.status(200).json(Items[0]);
  } catch (error) {
    console.error('Error getting post:', error);
    return res
      .status(500)
      .json({ error: 'Internal server error getting post' });
  }
});

// POST api/post/
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

      const s3Params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: photoName,
        Body: fileData,
        ACL: 'public-read',
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
        text: text,
        likes: [],
        comments: [],
        postedAt: new Date().toISOString(),
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

// DELETE api/post/
router.delete('/:postId', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User is not authenticated' });
  }

  try {
    const username = req.user.username;
    const { postId } = req.params;

    const checkPost = {
      TableName: POST_TABLE,
      IndexName: 'postId-index',
      KeyConditionExpression: 'postId = :postId',
      ExpressionAttributeValues: {
        ':postId': postId,
      },
    };

    const { Items } = await docClient.send(new QueryCommand(checkPost));

    if (!Items || Items.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const post = Items[0];

    if (post.username !== username) {
      return res
        .status(403)
        .json({ error: 'User is not authorized to delete this post' });
    }

    const dynamoParams = {
      TableName: POST_TABLE,
      Key: {
        postId: postId,
      },
    };

    await docClient.send(new DeleteCommand(dynamoParams));

    const s3Key = imageSrc.substring(imageSrc.lastIndexOf('/') + 1);

    const s3Params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: s3Key,
    };

    await s3Client.send(new DeleteObjectCommand(s3Params));

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting post: ', error);
    return res
      .status(500)
      .json({ error: 'Internal server error deleting post' });
  }
});

module.exports = router;
