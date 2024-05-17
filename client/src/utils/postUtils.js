import { mementoBackend } from './utils';
import { PostType } from './utils';

const sortReverseChronologicalOrder = (a, b) =>
  new Date(b.postedAt) - new Date(a.postedAt);

const sortPostsByType = (posts) => {
  const photos = [];
  const statuses = [];

  posts.forEach((post) => {
    if (post.type === PostType.PHOTO) {
      photos.push(JSON.parse(JSON.stringify(post)));
    } else if (post.type === PostType.STATUS) {
      statuses.push(JSON.parse(JSON.stringify(post)));
    }
  });

  return {
    photos: photos.sort(sortReverseChronologicalOrder),
    statuses: statuses.sort(sortReverseChronologicalOrder),
  };
};

const getPost = async (postId) => {
  try {
    const res = await mementoBackend.get(`/posts/${postId}`);
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

      await mementoBackend.post('/posts', formData);
    } else {
      await mementoBackend.post('/posts', {
        type,
        text,
      });
    }
  } catch (error) {
    throw error;
  }
};

const updatePost = async (postId, text) => {
  try {
    await mementoBackend.put(`/posts/${postId}`, { text });
  } catch (error) {
    throw error;
  }
};

const deletePost = async (postId) => {
  try {
    await mementoBackend.delete(`/posts/${postId}`);
  } catch (error) {
    throw error;
  }
};

const likePost = async (postId) => {
  try {
    await mementoBackend.put(`/posts/${postId}/like`);
  } catch (error) {
    throw error;
  }
};

const unlikePost = async (postId) => {
  try {
    await mementoBackend.put(`/posts/${postId}/unlike`);
  } catch (error) {
    throw error;
  }
};

const getAllHomeFeedPosts = async () => {
  try {
    const res = await mementoBackend.get('/posts/');
    const allFollowingPosts = res.data;
    return allFollowingPosts.sort(sortReverseChronologicalOrder);
  } catch (error) {
    throw error;
  }
};

export {
  sortPostsByType,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  getAllHomeFeedPosts,
};
