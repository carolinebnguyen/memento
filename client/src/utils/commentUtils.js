import { mementoBackend } from './utils';

const sortChronologicalOrder = (a, b) =>
  new Date(a.postedAt) - new Date(b.postedAt);

const sortComments = (comments) => {
  return comments.sort(sortChronologicalOrder);
};

const postComment = async (text, postId, poster) => {
  try {
    await mementoBackend.post('/comments', { text, postId, poster });
  } catch (error) {
    throw error;
  }
};

const updateComment = async (text, commentId) => {
  try {
    await mementoBackend.put(`/comments/${commentId}`, { text });
  } catch (error) {
    throw error;
  }
};

const deleteComment = async (commentId) => {
  try {
    await mementoBackend.delete(`/comments/${commentId}`);
  } catch (error) {
    throw error;
  }
};

export { sortComments, postComment, updateComment, deleteComment };
