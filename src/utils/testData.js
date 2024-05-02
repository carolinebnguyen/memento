import caroline from '../assets/placeholders/carolineAvatarClear.png';
import snowie from '../assets/snowieAvatar.png';

const carolineProfile = {
  username: 'carolibn',
  name: 'Caroline Nguyen',
  picture: caroline,
  bio: 'Developer \n Software Engineering Major',
  followersList: [],
  followingList: [],
  posts: [
    {
      imageSrc:
        'https://m.media-amazon.com/images/I/51b0f7Fz4KL._AC_UF1000,1000_QL80_.jpg',
      likes: 1,
      comments: [
        {
          user: 'snowie',
          comment: 'Nice pic!',
        },
      ],
      postedAt: new Date('2024-04-29T00:00:00Z'),
    },
  ],
  statuses: [
    {
      content: 'This is my first status',
      likes: 1,
      comments: [
        {
          user: 'snowie',
          comment: 'Hello there!',
        },
      ],
      postedAt: new Date('2024-03-29T00:00:00Z'),
    },
    {
      content: 'This is my second status! :)',
      likes: 0,
      comments: [],
      postedAt: new Date('2024-04-29T00:00:00Z'),
    },
    {
      content:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor doloribus voluptate modi libero sequi rerum asperiores laboriosam, dolore inventore molestias tempore eveniet dignissimos? Beatae iusto quibusdam repudiandae blanditiis voluptatum odio?',
      likes: 0,
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
  posts: [],
  statuses: [],
};

carolineProfile.followersList.push(snowieProfile);
carolineProfile.followingList.push(snowieProfile);

export { carolineProfile, snowieProfile };
