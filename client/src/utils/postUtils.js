import { PostType } from './utils';

const sortPostsByType = (posts) => {
  const photos = [];
  const statuses = [];

  posts.forEach((post) => {
    if (post.postType === PostType.PHOTO) {
      photos.push(post);
    } else if (post.postType === PostType.STATUS) {
      statuses.push(post);
    }
  });

  return { photos, statuses };
};

export { sortPostsByType };
