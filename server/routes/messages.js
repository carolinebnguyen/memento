const express = require('express');
const router = express.Router();
const crypto = require('crypto');

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient,
  QueryCommand,
  GetCommand,
  BatchGetCommand,
  TransactWriteCommand,
  PutCommand,
  UpdateCommand,
} = require('@aws-sdk/lib-dynamodb');

const USER_TABLE = 'User';
const CONVERSATION_TABLE = 'Conversation';

const dynamoDBClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
});
const docClient = DynamoDBDocumentClient.from(dynamoDBClient, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertEmptyValues: true,
  },
});

// GET api/messages/:conversationId
router.get('/:conversationId', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User is not authenticated' });
  }

  try {
    const username = req.user.username;
    const { conversationId } = req.params;

    if (!conversationId) {
      return res.status(400).json({ error: 'ConversationId is required' });
    }

    const checkConversationParams = {
      TableName: CONVERSATION_TABLE,
      Key: {
        conversationId: conversationId,
      },
    };

    const { Item: conversation } = await docClient.send(
      new GetCommand(checkConversationParams)
    );

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    conversation.participants = Array.from(conversation.participants);

    if (!conversation.participants.includes(username)) {
      return res
        .status(403)
        .json({ error: 'User is not authorized to view conversation' });
    }

    const batchGetUserParams = {
      RequestItems: {
        [USER_TABLE]: {
          Keys: conversation.participants.map((username) => ({
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

    conversation.participants = conversation.participants.map((username) => ({
      username,
      picture: userProfiles[username].picture,
      name: userProfiles[username].name,
    }));

    return res.status(200).json(conversation);
  } catch (error) {
    console.error('Error getting conversation: ', error);
    return res
      .status(500)
      .json({ error: 'Internal server error getting conversation' });
  }
});

// POST api/messages
router.post('/', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User is not authenticated' });
  }

  try {
    const sender = req.user.username;
    const { text, recipient } = req.body;

    if (sender === recipient) {
      return res
        .status(409)
        .json({ error: 'Users cannot send messages to themselves' });
    }

    const conversationId = crypto.randomUUID();

    const timestamp = new Date().toISOString();

    const message = {
      text: text,
      sender: sender,
      timestamp: timestamp,
    };

    const participants = new Set([sender, recipient]);

    const conversation = {
      conversationId: conversationId,
      participants: participants,
      messages: [message],
      lastUpdatedAt: timestamp,
    };

    const conversationParams = {
      TableName: CONVERSATION_TABLE,
      Item: conversation,
    };

    const senderParams = {
      TableName: USER_TABLE,
      Key: {
        username: sender,
      },
      UpdateExpression: 'ADD conversations :conversationId',
      ExpressionAttributeValues: {
        ':conversationId': new Set([conversationId]),
      },
      ConditionExpression: 'attribute_exists(username)',
    };

    const recipientParams = {
      TableName: USER_TABLE,
      Key: {
        username: recipient,
      },
      UpdateExpression: 'ADD conversations :conversationId',
      ExpressionAttributeValues: {
        ':conversationId': new Set([conversationId]),
      },
      ConditionExpression: 'attribute_exists(username)',
    };

    const createConversation = new PutCommand(conversationParams);
    const addSenderConversation = new UpdateCommand(senderParams);
    const addRecipientConversation = new UpdateCommand(recipientParams);

    const transactionParams = {
      TransactItems: [
        { Put: createConversation.input },
        { Update: addSenderConversation.input },
        { Update: addRecipientConversation.input },
      ],
    };

    await docClient.send(new TransactWriteCommand(transactionParams));

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error creating conversation: ', error);
    return res
      .status(500)
      .json({ error: 'Internal server error creating conversation' });
  }
});

// PUT api/messages
router.put('/:conversationId', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User is not authenticated' });
  }

  try {
    const sender = req.user.username;
    const { conversationId } = req.params;
    const { text } = req.body;

    if (!conversationId) {
      return res.status(400).json({ error: 'ConversationId is required' });
    }

    const checkConversationParams = {
      TableName: CONVERSATION_TABLE,
      Key: {
        conversationId: conversationId,
      },
    };

    const { Item: conversation } = await docClient.send(
      new GetCommand(checkConversationParams)
    );

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const timestamp = new Date().toISOString();

    const message = {
      text: text,
      sender: sender,
      timestamp: timestamp,
    };

    conversation.messages.push(message);

    const conversationParams = {
      TableName: CONVERSATION_TABLE,
      Key: {
        conversationId: conversationId,
      },
      UpdateExpression: 'SET messages = :messages, lastUpdatedAt = :timestamp',
      ExpressionAttributeValues: {
        ':messages': conversation.messages,
        ':timestamp': timestamp,
      },
    };

    await docClient.send(new UpdateCommand(conversationParams));

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending message: ', error);
    return res
      .status(500)
      .json({ error: 'Internal server error sending message' });
  }
});

module.exports = router;
