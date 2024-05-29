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
    await mementoBackend.post('/messages', { text, recipient });
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

const getConversationByUsername = async (recipient) => {
  try {
    const res = await mementoBackend.get(`/messages/${recipient}/conversation`);
    return res.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw error;
  }
};

export {
  getAllConversations,
  getConversationById,
  createConversation,
  sendMessage,
  getConversationByUsername,
};
