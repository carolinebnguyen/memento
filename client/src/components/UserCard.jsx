import React, { useEffect, useState } from 'react';
import {
  Flex,
  Text,
  Avatar,
  Button,
  HStack,
  Stack,
  Link,
  useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {
  checkIsFollowing,
  followUser,
  getCurrentUsername,
  unfollowUser,
} from '../utils/userUtils';
import { getFollowAction } from '../utils/utils';

export default function UserCard({ user, handleClose }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const { username, name, picture } = user;
  const [currentUsername, setCurrentUsername] = useState('');
  const [loadingState, setLoadingState] = useState('');

  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const currentUsername = await getCurrentUsername();
        const isFollowingUser = await checkIsFollowing(username);
        setCurrentUsername(currentUsername);
        setIsFollowing(isFollowingUser);
        setLoadingState('DONE');
      } catch (error) {
        setLoadingState('');
        return;
      }
    };
    fetchUserInfo();
  }, [username]);

  const handleNavigation = () => {
    if (handleClose) {
      handleClose();
    }
    navigate(`/profile/${username}`);
  };

  const toggleIsFollowing = async () => {
    try {
      if (!isFollowing) {
        await followUser(username);
      } else {
        await unfollowUser(username);
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
    <Flex justify="space-between" align="center">
      {loadingState === 'DONE' && (
        <>
          <HStack>
            <Avatar size="md" src={picture} />
            <Stack direction="column" gap={0}>
              <Link color="black" onClick={handleNavigation}>
                <Text as="b">{username}</Text>
              </Link>
              <Text fontSize="sm" color="gray" fontWeight={500}>
                {name}
              </Text>
            </Stack>
          </HStack>
          {username === currentUsername ? null : (
            <Button
              onClick={toggleIsFollowing}
              colorScheme={isFollowing ? 'gray' : 'blue'}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </Button>
          )}
        </>
      )}
    </Flex>
  );
}
