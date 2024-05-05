import React from 'react';
import {
  Flex,
  Text,
  Avatar,
  HStack,
  Stack,
  Link,
  Tooltip,
  Image,
  Box,
} from '@chakra-ui/react';
import {
  formatDateDistanceToNow,
  formatDate,
  getNotificationMessage,
} from '../utils/utils';
import { getPost } from '../utils/testData';
import { useNavigate } from 'react-router-dom';

export default function NotificationCard({ notification }) {
  const {
    user,
    postId,
    postType,
    notificationType,
    createdAt,
    commentContent,
  } = notification;
  const { username, picture } = user;
  const post = getPost(postId);
  const { imageSrc } = post;
  const navigate = useNavigate();

  const handleUserNavigation = () => {
    navigate(`/profile?username=${username}`);
  };

  const handlePostNavigation = () => {
    navigate(`/post?id=${postId}`);
  };

  return (
    <Flex align="center" w="full" p={2} _hover={{ backgroundColor: '#f5fbfc' }}>
      <Flex justify="space-between" w="100%" align="center" gap={8}>
        <Stack direction="row" display="flex" align="center">
          <Avatar size="md" src={picture} mr={2} />
          <Stack gap={0}>
            <HStack w="full" gap={1}>
              <Box>
                <Link color="black" onClick={handleUserNavigation}>
                  <Text as="b" fontSize="sm">
                    {username}
                  </Text>
                </Link>
                <Text fontSize="sm" fontWeight={400}>
                  {getNotificationMessage(notificationType)}
                  <Link onClick={handlePostNavigation} fontWeight={600}>
                    {postType}
                  </Link>
                  {commentContent && `: ${commentContent}`}
                </Text>
              </Box>
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
        </Stack>
        {imageSrc && (
          <Image
            src={imageSrc}
            boxSize={70}
            objectFit="cover"
            onClick={handlePostNavigation}
            _hover={{ cursor: 'pointer' }}
          />
        )}
      </Flex>
    </Flex>
  );
}
