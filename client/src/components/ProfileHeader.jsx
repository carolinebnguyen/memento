import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Button,
  Flex,
  Heading,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import UserModal from './UserModal';
import { getCurrentUsername } from '../utils/userUtils';

export default function ProfileHeader({ profile }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUsername, setCurrentUsername] = useState('');

  useEffect(() => {
    setIsLoading(true);
    const fetchCurrentUsername = async () => {
      const username = await getCurrentUsername();
      setCurrentUsername(username);
      setIsLoading(false);
    };
    fetchCurrentUsername();
  }, []);

  const {
    username,
    name,
    picture,
    bio,
    followersList,
    followingList,
    photoCount,
    statusCount,
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

  const { search } = useLocation();
  const searchedUsername = new URLSearchParams(search).get('username');

  const toggleIsFollowing = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <Flex mb={2}>
      {isLoading ? null : (
        <>
          <Avatar size="xl" mr={5} src={picture} />
          <Stack direction="column">
            <Stack direction="row" gap={5}>
              <Heading as="h1" size="md" noOfLines={1}>
                {username}
              </Heading>
              {searchedUsername === currentUsername ? (
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
            <Stack direction="row" gap={8} mt={2}>
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
                  {followersList && followersList.length}
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
                  {followingList && followingList.length}
                </Text>
                <Text fontSize="sm" fontWeight={500}>
                  following
                </Text>
              </Stack>
              <UserModal
                isOpen={isOpenFollowing}
                onClose={onCloseFollowing}
                title="Following"
                usersList={followingList}
              />
            </Stack>
            <Heading as="h2" size="xs" noOfLines={1} mt={2}>
              {name}
            </Heading>
            <Text fontSize="sm" whiteSpace="pre-line">
              {bio}
            </Text>
          </Stack>
        </>
      )}
    </Flex>
  );
}
