import caroline from '../assets/placeholders/carolineAvatarClear.png';
import snowie from '../assets/snowieAvatar.png';
import brownPomeranian from '../assets/placeholders/brownPomeranian.jpg';
import bears1 from '../assets/placeholders/carolibnPhoto1.jpg';
import bears2 from '../assets/placeholders/carolibnPhoto2.jpg';
import { NotificationType, PostType } from './utils';

const carolibnPhoto1 = {
  id: 2,
  postedBy: 'carolibn',
  type: PostType.PHOTO,
  imageSrc: bears1,
  caption: 'First picture! Found this cute and wanted to share',
  likes: [],
  comments: [
    {
      id: 1,
      user: 'snowie',
      content: 'Nice pic!',
      postedAt: new Date('2024-04-29T02:00:00Z'),
    },
  ],
  postedAt: new Date('2024-04-29T00:00:00Z'),
};

const carolibnPhoto2 = {
  id: 4,
  postedBy: 'carolibn',
  type: PostType.PHOTO,
  imageSrc: bears2,
  caption:
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam voluptate, sunt perspiciatis deleniti odit quo eos commodi esse id libero, optio, cumque voluptas exercitationem ipsam rerum amet ea iusto illo!',
  likes: [],
  comments: [],
  postedAt: new Date('2024-04-30T00:00:00Z'),
};

const carolibnStatus1 = {
  id: 1,
  postedBy: 'carolibn',
  type: PostType.STATUS,
  content: 'This is my first status',
  likes: [],
  comments: [
    {
      user: 'snowie',
      id: 2,
      content: 'Hello there!',
      postedAt: new Date('2024-03-30T00:00:00Z'),
    },
    {
      user: 'snowie',
      id: 3,
      content: 'Happy to have you :D',
      postedAt: new Date('2024-03-30T00:00:05Z'),
    },
  ],
  postedAt: new Date('2024-03-29T00:00:00Z'),
};

const carolibnStatus2 = {
  id: 3,
  postedBy: 'carolibn',
  type: PostType.STATUS,
  content: 'This is my second status! :)',
  likes: [],
  comments: [],
  postedAt: new Date('2024-04-29T01:00:00Z'),
};

const carolibnStatus3 = {
  id: 5,
  postedBy: 'carolibn',
  type: PostType.STATUS,
  content:
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor doloribus voluptate modi libero sequi rerum asperiores laboriosam, dolore inventore molestias tempore eveniet dignissimos? Beatae iusto quibusdam repudiandae blanditiis voluptatum odio?',
  likes: [],
  comments: [],
  postedAt: new Date('2024-05-01T01:00:00Z'),
};

const snowiePhoto1 = {
  id: 6,
  postedBy: 'snowie',
  type: PostType.PHOTO,
  imageSrc: brownPomeranian,
  caption: 'Dedicating my first photo to my sister, Brownie <3',
  likes: [],
  comments: [
    {
      id: 4,
      user: 'carolibn',
      content: 'Cute! :)',
      postedAt: new Date('2024-05-03T09:00:00Z'),
    },
  ],
  postedAt: new Date('2024-05-03T00:00:00Z'),
};

const snowieStatus1 = {
  id: 7,
  postedBy: 'snowie',
  type: PostType.STATUS,
  content: 'Hi everyone, this is my first status!!',
  likes: [],
  comments: [
    {
      id: 5,
      user: 'snowie',
      content: 'Commenting for reach',
      postedAt: new Date('2024-05-02T09:00:00Z'),
    },
    {
      id: 6,
      user: 'carolibn',
      content: 'Hellooo',
      postedAt: new Date('2024-05-02T09:05:00Z'),
    },
  ],
  postedAt: new Date('2024-05-01T00:00:00Z'),
};

const carolineProfile = {
  username: 'carolibn',
  name: 'Caroline Nguyen',
  email: 'test@email.com',
  picture: caroline,
  bio: 'Developer \n Software Engineering Major',
  followersList: [],
  followingList: [],
  photos: [carolibnPhoto1, carolibnPhoto2],
  statuses: [carolibnStatus1, carolibnStatus2, carolibnStatus3],
};

const snowieProfile = {
  username: 'snowie',
  name: 'Snowie Pom',
  picture: snowie,
  bio: 'Pom',
  followersList: [carolineProfile],
  followingList: [carolineProfile],
  photos: [snowiePhoto1],
  statuses: [snowieStatus1],
};

carolineProfile.followersList.push(snowieProfile);
carolineProfile.followingList.push(snowieProfile);
carolineProfile.photos[0].likes.push(snowieProfile);
carolineProfile.statuses[0].likes.push(snowieProfile);

const notifications = [
  {
    id: 1,
    user: snowieProfile,
    notificationType: NotificationType.FOLLOW,
    createdAt: new Date('2024-03-29T00:00:00Z'),
  },
  {
    id: 2,
    user: snowieProfile,
    postType: PostType.STATUS,
    postId: 1,
    notificationType: NotificationType.LIKE,
    createdAt: new Date('2024-03-30T00:00:00Z'),
  },
  {
    id: 3,
    user: snowieProfile,
    postId: 1,
    postType: PostType.STATUS,
    notificationType: NotificationType.COMMENT,
    createdAt: new Date('2024-03-30T00:00:00Z'),
    commentId: 2,
    commentContent: 'Hello there!',
  },
  {
    id: 4,
    user: snowieProfile,
    postId: 2,
    postType: PostType.PHOTO,
    notificationType: NotificationType.COMMENT,
    createdAt: new Date('2024-04-29T02:00:00Z'),
    commentId: 1,
    commentContent: 'Nice pic!',
  },
];

const postIdToPostMap = {
  1: carolibnStatus1,
  2: carolibnPhoto1,
  3: carolibnStatus2,
  4: carolibnPhoto2,
  5: carolibnStatus3,
  6: snowiePhoto1,
  7: snowieStatus1,
};

const getPost = (postId) => {
  if (!(postId in postIdToPostMap)) {
    return '';
  }
  return postIdToPostMap[postId];
};

const usernameToProfileMap = {
  carolibn: carolineProfile,
  snowie: snowieProfile,
};

const getProfile = (username) => {
  if (!(username in usernameToProfileMap)) {
    return usernameToProfileMap['carolibn'];
  }
  return usernameToProfileMap[username];
};

const allPosts = Object.values(postIdToPostMap);

const photoPosts = allPosts.filter((post) => post.type === PostType.PHOTO);
const statusPosts = allPosts.filter((post) => post.type === PostType.STATUS);

const sortReverseChronologicalOrder = (a, b) => b.postedAt - a.postedAt;

const categorizedPosts = {
  all: allPosts.sort(sortReverseChronologicalOrder),
  photos: photoPosts.sort(sortReverseChronologicalOrder),
  statuses: statusPosts.sort(sortReverseChronologicalOrder),
};

export {
  carolineProfile,
  snowieProfile,
  notifications,
  postIdToPostMap,
  getPost,
  usernameToProfileMap,
  getProfile,
  categorizedPosts,
};
