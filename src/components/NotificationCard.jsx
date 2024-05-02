import React from 'react';
import {
  Flex,
  Text,
  Avatar,
  HStack,
  Stack,
  Link,
  Tooltip,
} from '@chakra-ui/react';
import {
  formatDateDistanceToNow,
  formatDate,
  getNotificationMessage,
} from '../utils/utils';
import { useNavigate } from 'react-router-dom';

export default function NotificationCard({ notification }) {
  const { user, type, createdAt, commentContent } = notification;
  const { username, picture } = user;
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate(`/profile?username=${username}`);
  };

  return (
    <Flex align="center" w="full" my={2}>
      <Avatar size="md" src={picture} mr={2} />
      <Stack gap={0}>
        <HStack w="full" gap={1}>
          <Link color="black" onClick={handleNavigation}>
            <Text as="b" fontSize="sm">
              {username}
            </Text>
          </Link>
          <Text fontSize="sm" color="gray" fontWeight={500}>
            {getNotificationMessage(type)} {commentContent}
          </Text>
        </HStack>
        <Tooltip
          label={formatDate(createdAt)}
          placement="bottom"
          openDelay={500}
        >
          <Text fontSize="xs" color="gray" fontWeight={500}>
            {formatDateDistanceToNow(createdAt)}
          </Text>
        </Tooltip>
      </Stack>
    </Flex>
  );
}
