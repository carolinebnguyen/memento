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
} = require('@aws-sdk/lib-dynamodb');

const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require('@aws-sdk/client-s3');

const USER_TABLE = 'User';
const POST_TABLE = 'Post';

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
    return res.status(400).json({ error: 'PostID is required' });
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

    post.comments = Array.from(post?.comments || []);
    post.likes = Array.from(post?.likes || new Set());

    const batchGetUserParams = {
      RequestItems: {
        [USER_TABLE]: {
          Keys: Array.from(post.likes).map((username) => ({
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

    const userParams = {
      TableName: USER_TABLE,
      Key: {
        username: post.username,
      },
    };

    const { Item: user } = await docClient.send(new GetCommand(userParams));

    post.profilePicture = user.picture;

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
    const userPromises = usernames.map((username) =>
      docClient.send(
        new GetCommand({
          TableName: USER_TABLE,
          Key: { username: username },
        })
      )
    );

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

    const users = await Promise.all(userPromises);
    const postsByUser = await Promise.all(postPromises);

    const profilePictures = users.reduce((acc, userData) => {
      if (userData.Item) {
        acc[userData.Item.username] = userData.Item.picture;
      }
      return acc;
    }, {});

    const posts = postsByUser.flatMap((postData) => {
      return postData.Items.map((post) => ({
        ...post,
        comments: Array.from(post?.comments || []),
        likes: Array.from(post?.likes || []),
        profilePicture: profilePictures[post.username],
      }));
    });

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

    await docClient.send(new UpdateCommand(likeParams));

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error liking post: ', error);
    return res.status(500).json({ error: 'Internal server error liking post' });
  }
});

// PUT api/posts/:postId/unlike
router.put('/:postId/unlike', async (req, res) => {
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

    const unlikeParams = {
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

    await docClient.send(new UpdateCommand(unlikeParams));

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

    const dynamoParams = {
      TableName: POST_TABLE,
      Key: {
        username: username,
        postId: postId,
      },
    };

    await docClient.send(new DeleteCommand(dynamoParams));

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
