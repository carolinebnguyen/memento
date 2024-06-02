import { mementoBackend } from './utils';

const sortChronologicalOrder = (a, b) =>
  new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp);

const sortConversations = (conversations) => {
  return conversations.sort(sortChronologicalOrder);
};

const getAllConversations = async () => {
  try {
    const res = await mementoBackend.get('/messages');
    const conversations = res.data;
    return sortConversations(conversations);
  } catch (error) {
    throw error;
  }
};

const getConversationById = async (conversationId) => {
  try {
    const res = await mementoBackend.get(`/messages/${conversationId}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

const createConversation = async (text, recipient) => {
  try {
    const res = await mementoBackend.post('/messages', { text, recipient });
    return res.data;
  } catch (error) {
    throw error;
  }
};

const sendMessage = async (conversationId, text) => {
  try {
    await mementoBackend.put(`/messages/${conversationId}`, { text });
  } catch (error) {
    throw error;
  }
};

const getConversationIdByUsername = async (recipient) => {
  try {
    const res = await mementoBackend.get(
      `/messages/${recipient}/conversationId`
    );
    return res.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw error;
  }
};

const groupMessagesByDate = (messages) => {
  return messages.reduce((acc, message) => {
    const date = new Date(message.timestamp);
    date.setHours(0, 0, 0, 0);
    const dateString = date.toDateString();
    if (!acc[dateString]) {
      acc[dateString] = [];
    }
    acc[dateString].push(message);
    return acc;
  }, {});
};

const updateConversationListOrder = (conversationList, conversationId) => {
  if (!conversationList || !conversationId) {
    return [];
  }

  if (conversationList[0].conversationId !== conversationId) {
    const index = conversationList.findIndex(
      (conversation) => conversation.conversationId === conversationId
    );
    if (index !== -1) {
      const conversationToMove = conversationList.splice(index, 1)[0];
      conversationList.unshift(conversationToMove);
    }
  }
  return conversationList;
};

export {
  getAllConversations,
  getConversationById,
  createConversation,
  sendMessage,
  getConversationIdByUsername,
  groupMessagesByDate,
  updateConversationListOrder,
};
