import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Button,
  Flex,
  Heading,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { Link, useParams } from 'react-router-dom';
import UserModal from './UserModal';
import {
  followUser,
  getCurrentUsername,
  unfollowUser,
} from '../utils/userUtils';
import { getFollowAction } from '../utils/utils';

export default function ProfileHeader({ profile, isFollowingUser }) {
  const [isFollowing, setIsFollowing] = useState(isFollowingUser);
  const [currentUsername, setCurrentUsername] = useState('');
  const toast = useToast();

  const {
    username,
    name,
    picture,
    bio,
    followers,
    following,
    photoCount,
    statusCount,
  } = profile;

  const [followersList, setFollowersList] = useState(followers);

  useEffect(() => {
    const fetchCurrentUsername = async () => {
      const currentUsername = await getCurrentUsername();
      setCurrentUsername(currentUsername);
    };
    fetchCurrentUsername();
  }, [username]);

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

  const { username: userParam } = useParams();

  const toggleIsFollowing = async () => {
    try {
      if (!isFollowing) {
        await followUser(userParam);
        setFollowersList((followersList) => [
          ...followersList,
          currentUsername,
        ]);
      } else {
        await unfollowUser(userParam);
        setFollowersList((followersList) =>
          followersList.filter((follower) => follower !== currentUsername)
        );
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      toast({
        title: 'Error',
        description: `An error occurred while attempting to ${getFollowAction(
          isFollowing
        )} user`,
        status: 'error',
        duration: 3000,
        variant: 'subtle',
        position: 'top',
        containerStyle: {
          zIndex: '9999',
        },
      });
    }
  };

  return (
    <Flex mb={2} w="100%" justify="center">
      <Avatar size="xl" mr={5} src={picture} />
      <Stack direction="column">
        <Stack direction="row" gap={5}>
          <Heading as="h1" size="md" noOfLines={1}>
            {username}
          </Heading>
          {userParam === currentUsername ? (
            <Link to="/settings">
              <Button colorScheme="blue" size="xs">
                Edit Profile
              </Button>
            </Link>
          ) : (
            <Button
              onClick={toggleIsFollowing}
              colorScheme={isFollowing ? 'gray' : 'blue'}
              size="xs"
            >
              {isFollowing ? 'Following' : 'Follow'}
            </Button>
          )}
        </Stack>
        <Stack direction="row" gap={6} mt={2}>
          <Stack
            direction={{ base: 'column', sm: 'row' }}
            gap={{ base: 0, sm: 1 }}
            align="center"
          >
            <Text as="b" fontSize="sm">
              {photoCount}
            </Text>
            <Text fontSize="sm" fontWeight={500}>
              {photoCount === 1 ? 'photo' : 'photos'}
            </Text>
          </Stack>
          <Stack
            direction={{ base: 'column', sm: 'row' }}
            gap={{ base: 0, sm: 1 }}
            align="center"
          >
            <Text as="b" fontSize="sm">
              {statusCount}
            </Text>
            <Text fontSize="sm" fontWeight={500}>
              {statusCount === 1 ? 'status' : 'statuses'}
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
              {(followersList && followersList.length) || 0}
            </Text>
            <Text fontSize="sm" fontWeight={500}>
              {followersList && followersList.length === 1
                ? 'follower'
                : 'followers'}
            </Text>
            <UserModal
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
              {(following && following.length) || 0}
            </Text>
            <Text fontSize="sm" fontWeight={500}>
              following
            </Text>
          </Stack>
          <UserModal
            isOpen={isOpenFollowing}
            onClose={onCloseFollowing}
            title="Following"
            usersList={following}
          />
        </Stack>
        <Heading as="h2" size="xs" noOfLines={1} mt={2}>
          {name}
        </Heading>
        <Text fontSize="sm" whiteSpace="pre-line">
          {bio}
        </Text>
      </Stack>
    </Flex>
  );
}
