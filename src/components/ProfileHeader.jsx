import React from 'react';
import {
  Avatar,
  Button,
  Flex,
  Heading,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import FollowModal from './FollowModal';

export default function ProfileHeader({ profile }) {
  const {
    username,
    name,
    picture,
    bio,
    followersList,
    followingList,
    posts,
    statuses,
  } = profile;

  const {
    isOpen: isOpenFollower,
    onOpen: onOpenFollower,
    onClose: onCloseFollower,
  } = useDisclosure();
  const {
    isOpen: isOpenFollowing,
    onOpen: onOpenFollowing,
    onClose: onCloseFollowing,
  } = useDisclosure();

  return (
    <Flex mb={2}>
      <Avatar size="xl" mr={5} src={picture} />
      <Stack direction="column">
        <Stack direction="row" gap={5}>
          <Heading as="h1" size="md" noOfLines={1}>
            {username}
          </Heading>
          <Link to="/settings">
            <Button colorScheme="blue" size="xs">
              Edit Profile
            </Button>
          </Link>
        </Stack>

        <Stack direction="row" gap={8} mt={2}>
          <Stack
            direction={{ base: 'column', sm: 'row' }}
            gap={{ base: 0, sm: 1 }}
            align="center"
          >
            <Text as="b" fontSize="sm">
              {posts.length}
            </Text>
            <Text fontSize="sm" fontWeight={500}>
              {posts.length === 1 ? 'post' : 'posts'}
            </Text>
          </Stack>
          <Stack
            direction={{ base: 'column', sm: 'row' }}
            gap={{ base: 0, sm: 1 }}
            align="center"
          >
            <Text as="b" fontSize="sm">
              {statuses.length}
            </Text>
            <Text fontSize="sm" fontWeight={500}>
              {statuses.length === 1 ? 'status' : 'statuses'}
            </Text>
          </Stack>
          <Stack
            direction={{ base: 'column', sm: 'row' }}
            gap={{ base: 0, sm: 1 }}
            align="center"
            _hover={{ textDecoration: 'underline', cursor: 'pointer' }}
            onClick={onOpenFollower}
          >
            <Text as="b" fontSize="sm">
              {followersList.length}
            </Text>
            <Text fontSize="sm" fontWeight={500}>
              {followersList.length === 1 ? 'follower' : 'followers'}
            </Text>
            <FollowModal
              isOpen={isOpenFollower}
              onClose={onCloseFollower}
              title="Followers"
              usersList={followersList}
            />
          </Stack>
          <Stack
            direction={{ base: 'column', sm: 'row' }}
            gap={{ base: 0, sm: 1 }}
            align="center"
            _hover={{ textDecoration: 'underline', cursor: 'pointer' }}
            onClick={onOpenFollowing}
          >
            <Text as="b" fontSize="sm">
              {followingList.length}
            </Text>
            <Text fontSize="sm" fontWeight={500}>
              following
            </Text>
          </Stack>
          <FollowModal
            isOpen={isOpenFollowing}
            onClose={onCloseFollowing}
            title="Following"
            usersList={followingList}
          />
        </Stack>

        <Heading as="h2" size="xs" noOfLines={1} my={2}>
          {name}
        </Heading>

        <Text fontSize="sm" whiteSpace="pre-line">
          {bio}
        </Text>
      </Stack>
    </Flex>
  );
}
