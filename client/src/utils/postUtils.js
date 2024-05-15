import { mementoBackend } from './utils';
import { PostType } from './utils';

const sortReverseChronologicalOrder = (a, b) =>
  new Date(b.postedAt) - new Date(a.postedAt);

const sortPostsByType = (posts) => {
  const photos = [];
  const statuses = [];

  posts.forEach((post) => {
    if (post.type === PostType.PHOTO) {
      photos.push(post);
    } else if (post.type === PostType.STATUS) {
      statuses.push(post);
    }
  });

  return {
    photos: photos.sort(sortReverseChronologicalOrder),
    statuses: statuses.sort(sortReverseChronologicalOrder),
  };
};

const getPost = async (postId) => {
  try {
    const res = await mementoBackend.get(`/post/${postId}`);
    const post = res.data;
    return post;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw error;
  }
};

const createPost = async (post) => {
  try {
    const { file, type, text } = post;

    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      formData.append('text', text);

      await mementoBackend.post('/post', formData);
    } else {
      await mementoBackend.post('/post', {
        type,
        text,
      });
    }
  } catch (error) {
    throw error;
  }
};

const deletePost = async (postId) => {
  try {
    await mementoBackend.delete(`/post/${postId}`);
  } catch (error) {
    throw error;
  }
};

export { sortPostsByType, getPost, createPost, deletePost };
