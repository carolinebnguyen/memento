import caroline from '../assets/placeholders/carolineAvatarClear.png';
import snowie from '../assets/snowieAvatar.png';
import { NotificationType } from './utils';

const carolineProfile = {
  username: 'carolibn',
  name: 'Caroline Nguyen',
  email: 'test@email.com',
  picture: caroline,
  bio: 'Developer \n Software Engineering Major',
  followersList: [],
  followingList: [],
  photos: [
    {
      id: 2,
      imageSrc:
        'https://m.media-amazon.com/images/I/51b0f7Fz4KL._AC_UF1000,1000_QL80_.jpg',
      likes: [],
      comments: [
        {
          id: 1,
          user: 'snowie',
          comment: 'Nice pic!',
          postedAt: new Date('2024-04-29T02:00:00Z'),
        },
      ],
      postedAt: new Date('2024-04-29T00:00:00Z'),
    },
    {
      id: 4,
      imageSrc:
        'https://ih1.redbubble.net/image.3787621272.3825/bg,f8f8f8-flat,750x,075,f-pad,750x1000,f8f8f8.jpg',
      likes: 0,
      comments: [],
      postedAt: new Date('2024-04-30T00:00:00Z'),
    },
  ],
  statuses: [
    {
      id: 1,
      content: 'This is my first status',
      likes: [],
      comments: [
        {
          user: 'snowie',
          id: 2,
          comment: 'Hello there!',
          postedAt: new Date('2024-03-30T00:00:00Z'),
        },
      ],
      postedAt: new Date('2024-03-29T00:00:00Z'),
    },
    {
      id: 3,
      content: 'This is my second status! :)',
      likes: [],
      comments: [],
      postedAt: new Date('2024-04-29T01:00:00Z'),
    },
    {
      id: 5,
      content:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor doloribus voluptate modi libero sequi rerum asperiores laboriosam, dolore inventore molestias tempore eveniet dignissimos? Beatae iusto quibusdam repudiandae blanditiis voluptatum odio?',
      likes: [],
      comments: [],
      postedAt: new Date('2024-05-01T00:00:00Z'),
    },
  ],
};

const snowieProfile = {
  username: 'snowie',
  name: 'Snowie Pom',
  picture: snowie,
  bio: 'Pom',
  followersList: [carolineProfile],
  followingList: [carolineProfile],
  photos: [],
  statuses: [],
};

carolineProfile.followersList.push(snowieProfile);
carolineProfile.followingList.push(snowieProfile);
carolineProfile.photos[0].likes.push(snowieProfile);
carolineProfile.statuses[0].likes.push(snowieProfile);

const notifications = [
  {
    id: 1,
    user: snowieProfile,
    type: NotificationType.FOLLOW,
    createdAt: new Date('2024-03-29T00:00:00Z'),
  },
  {
    id: 2,
    user: snowieProfile,
    postId: 1,
    type: NotificationType.LIKE,
    createdAt: new Date('2024-03-30T00:00:00Z'),
  },
  {
    id: 3,
    user: snowieProfile,
    postId: 1,
    type: NotificationType.COMMENT,
    createdAt: new Date('2024-03-30T00:00:00Z'),
    commentId: 2,
    commentContent: 'Hello there!',
  },
  {
    id: 4,
    user: snowieProfile,
    postId: 2,
    type: NotificationType.COMMENT,
    createdAt: new Date('2024-04-29T02:00:00Z'),
    commentId: 1,
    commentContent: 'Nice pic!',
  },
];

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

export {
  carolineProfile,
  snowieProfile,
  notifications,
  usernameToProfileMap,
  getProfile,
};
