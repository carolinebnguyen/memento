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
const { createParticipantKey } = require('../utils/messageUtils');

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

// GET api/messages/
router.get('/', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User is not authenticated' });
  }

  async function getAllConversations(conversationIds) {
    const conversationPromises = conversationIds.map((conversationId) =>
      docClient.send(
        new QueryCommand({
          TableName: CONVERSATION_TABLE,
          KeyConditionExpression: 'conversationId = :conversationId',
          ExpressionAttributeValues: {
            ':conversationId': conversationId,
          },
          ProjectionExpression: 'conversationId, participants, lastMessage',
        })
      )
    );

    const allConversations = await Promise.all(conversationPromises);
    const conversations = allConversations.flatMap(
      (conversationData) => conversationData.Items
    );

    const uniqueUsernames = new Set();

    conversations.forEach((conversation) => {
      conversation.participants.forEach((participant) => {
        uniqueUsernames.add(participant);
      });
    });

    const batchGetUserParams = {
      RequestItems: {
        [USER_TABLE]: {
          Keys: Array.from(uniqueUsernames).map((username) => ({
            username: username.toLowerCase(),
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

    conversations.forEach((conversation) => {
      conversation.participants = Array.from(conversation.participants);
      conversation.participants = conversation.participants.map((username) => ({
        username,
        picture: userProfiles[username].picture,
        name: userProfiles[username].name,
      }));
    });

    return conversations;
  }

  try {
    const username = req.user.username.toLowerCase();

    const getUserParams = {
      TableName: USER_TABLE,
      Key: {
        username: username,
      },
    };
    const { Item: user } = await docClient.send(new GetCommand(getUserParams));
    user.conversations = Array.from(user.conversations) || new Set();

    const conversations = await getAllConversations(user.conversations);

    return res.status(200).json(conversations);
  } catch (error) {
    console.error('Error getting conversations: ', error);
    return res
      .status(500)
      .json({ error: 'Internal server error getting conversations' });
  }
});

// GET api/messages/:conversationId
router.get('/:conversationId', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User is not authenticated' });
  }

  try {
    const username = req.user.username.toLowerCase();
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
            username: username.toLowerCase(),
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

// GET api/messages/:username/conversation
router.get('/:username/conversation', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User is not authenticated' });
  }

  try {
    const sender = req.user.username.toLowerCase();
    const { username } = req.params;
    const recipient = username.toLowerCase();

    const participantKey = createParticipantKey(sender, recipient);

    const conversationParams = {
      TableName: CONVERSATION_TABLE,
      IndexName: 'participantKey-index',
      KeyConditionExpression: 'participantKey = :participantKey',
      ExpressionAttributeValues: {
        ':participantKey': participantKey,
      },
    };

    const { Items } = await docClient.send(
      new QueryCommand(conversationParams)
    );

    if (!Items || Items.length === 0) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const conversation = Items[0];

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
    const sender = req.user.username.toLowerCase();
    const recipient = req.body.recipient.toLowerCase();
    const text = req.body.text;

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
    const participantKey = createParticipantKey(sender, recipient);

    const conversation = {
      conversationId: conversationId,
      participants: participants,
      messages: [message],
      lastMessage: message,
      participantKey: participantKey,
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
    const sender = req.user.username.toLowerCase();
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

    const message = {
      text: text,
      sender: sender,
      timestamp: new Date().toISOString(),
    };

    conversation.messages.push(message);

    const conversationParams = {
      TableName: CONVERSATION_TABLE,
      Key: {
        conversationId: conversationId,
      },
      UpdateExpression: 'SET messages = :messages, lastMessage = :message',
      ExpressionAttributeValues: {
        ':messages': conversation.messages,
        ':message': message,
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
