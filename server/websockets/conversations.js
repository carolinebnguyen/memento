const express = require('express');
const router = express.Router();
const chalk = require('chalk');

const CONNECTION_TIMEOUT = 60 * 60 * 1000; // 60 mins * 60 seconds * 1000ms

const conversations = new Map();

// WebSocket /ws/conversations/subscribe
router.ws('/subscribe/:conversationId', (ws, req) => {
  const username = req.user.username.toLowerCase();
  const { conversationId } = req.params;

  if (!conversations.has(conversationId)) {
    conversations.set(conversationId, new Map());
  }

  conversations.get(conversationId).set(username, ws);

  console.log(
    `User ${chalk.blue(req.user.username)} has ${chalk.green(
      'subscribed'
    )} to conversationId ${chalk.cyan(conversationId)}`
  );

  const timeout = setTimeout(() => {
    conversations.get(conversationId).delete(username);
    ws.close();
  }, CONNECTION_TIMEOUT);

  ws.on('close', () => {
    conversations.get(conversationId).delete(username);
    clearTimeout(timeout);

    console.log(
      `User ${chalk.blue(req.user.username)} has ${chalk.red(
        'unsubscribed'
      )} to conversationId ${chalk.cyan(conversationId)}`
    );
  });
});

// Send message to any subscribed users of the conversation
const sendMessageToConversation = (conversationId, sender, message) => {
  if (conversations.has(conversationId)) {
    const conversation = conversations.get(conversationId);

    conversation.forEach((ws, username) => {
      if (sender !== username && ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify(message));
      }
    });
  }
};

module.exports = router;
module.exports.sendMessageToConversation = sendMessageToConversation;
