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
import { formatDateDistanceToNow, formatDate } from '../utils/utils';
import { useNavigate } from 'react-router-dom';
import { getNotificationMessage } from '../utils/notificationUtils';

export default function NotificationCard({ notification }) {
  const {
    sender,
    postId,
    postType,
    postImage,
    notificationType,
    createdAt,
    commentContent,
    statusContent,
  } = notification;
  const { username, picture } = sender;
  const navigate = useNavigate();

  const handleUserNavigation = () => {
    navigate(`/profile/${sender}`);
  };

  const handlePostNavigation = () => {
    navigate(`/post/${postId}`);
  };

  return (
    <Flex align="center" w="full" p={2} _hover={{ backgroundColor: '#f5fbfc' }}>
      <Flex justify="space-between" w="100%" align="center" gap={8}>
        <Stack direction="row" display="flex" align="center">
          <Avatar size="md" src={picture} mr={2} />
          <Stack gap={0}>
            <HStack w="full" gap={1}>
              <Box>
                <Text fontSize="sm" fontWeight={400} noOfLines={2}>
                  <Link
                    color="black"
                    onClick={handleUserNavigation}
                    fontWeight={600}
                  >
                    {`${username} `}
                  </Link>
                  {getNotificationMessage(notificationType)}
                  <Link onClick={handlePostNavigation} fontWeight={600}>
                    {postType}
                  </Link>
                  {commentContent && `: ${commentContent}`}
                  {statusContent && `: ${statusContent}`}
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
        {postImage && (
          <Image
            src={postImage}
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
