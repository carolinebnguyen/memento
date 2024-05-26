import { mementoBackend } from './utils';

const getAllConversations = async () => {
  try {
    const res = await mementoBackend.get('/messages');
    return res.data;
  } catch (error) {
    throw error;
  }
};

const getConversation = async (conversationId) => {
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

export {
  getAllConversations,
  getConversation,
  createConversation,
  sendMessage,
};
