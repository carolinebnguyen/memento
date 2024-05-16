import React, { useEffect, useState } from 'react';
import {
  Flex,
  Text,
  Avatar,
  Button,
  HStack,
  Stack,
  Link,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUsername } from '../utils/userUtils';

export default function UserCard({ user, handleClose }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const { username, name, picture } = user;
  const navigate = useNavigate();
  const [currentUsername, setCurrentUsername] = useState('');

  useEffect(() => {
    const fetchCurrentUsername = async () => {
      const username = await getCurrentUsername();
      setCurrentUsername(username);
    };
    fetchCurrentUsername();
  }, []);

  const handleNavigation = () => {
    if (handleClose) {
      handleClose();
    }
    navigate(`/profile/${username}`);
  };

  const toggleIsFollowing = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <Flex justify="space-between" align="center">
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
    </Flex>
  );
}
