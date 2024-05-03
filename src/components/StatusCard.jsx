import React, { useState } from 'react';
import {
  Flex,
  Button,
  Text,
  Avatar,
  Heading,
  Stack,
  Tooltip,
  Icon,
  useDisclosure,
} from '@chakra-ui/react';
import { FaRegHeart, FaHeart, FaRegComment, FaEllipsis } from 'react-icons/fa6';
import UserModal from './UserModal';
import { formatDateDistanceToNow, formatDate } from '../utils/utils';
import { carolineProfile } from '../utils/testData';

export default function StatusCard({ username, picture, status }) {
  const { content, likes, comments, postedAt } = status;
  const [isLiked, setIsLiked] = useState(false);
  const [modifiedLikes, setModifiedLikes] = useState(likes);

  const {
    isOpen: isOpenLikes,
    onOpen: onOpenLikes,
    onClose: onCloseLikes,
  } = useDisclosure();
  const {
    isOpen: isOpenComments,
    onOpen: onOpenComments,
    onClose: onCloseComments,
  } = useDisclosure();

  const toggleIsLiked = () => {
    if (isLiked) {
      setModifiedLikes(
        modifiedLikes.filter((user) => user !== carolineProfile)
      );
    } else {
      setModifiedLikes([...modifiedLikes, carolineProfile]);
    }
    setIsLiked(!isLiked);
  };

  return (
    <Flex direction="column">
      <Flex justify="space-between">
        <Stack direction="row" align="center" gap={2}>
          <Avatar size="xs" src={picture} />
          <Heading as="h2" size="xs" noOfLines={1}>
            {username}
          </Heading>
          <Tooltip
            label={formatDate(postedAt)}
            placement="bottom"
            openDelay={500}
          >
            <Text fontSize="xs" color="gray">
              {formatDateDistanceToNow(postedAt)}
            </Text>
          </Tooltip>
        </Stack>
        <Button size="xs" colorScheme="whiteAlpha">
          <FaEllipsis size={16} color="gray" />
        </Button>
      </Flex>
      <Text fontSize="sm" my={2} textAlign="left">
        {content}
      </Text>
      <Flex justify="space-between">
        <Stack direction="row" gap={0}>
          <Button size="xs" colorScheme="whiteAlpha" onClick={toggleIsLiked}>
            <Icon
              as={isLiked ? FaHeart : FaRegHeart}
              boxSize={18}
              color={isLiked ? 'skyblue' : 'gray'}
              _hover={{ opacity: '50%' }}
            />
          </Button>
          <Button size="xs" colorScheme="whiteAlpha">
            <Icon
              as={FaRegComment}
              boxSize={18}
              color="gray"
              _hover={{ opacity: '50%' }}
            />
          </Button>
        </Stack>
        <Stack direction="row" gap={0}>
          <Text
            fontSize="xs"
            _hover={{ textDecoration: 'underline', cursor: 'pointer' }}
            onClick={onOpenLikes}
          >
            {modifiedLikes.length}{' '}
            {modifiedLikes.length === 1 ? 'like' : 'likes'}
          </Text>
          <UserModal
            isOpen={isOpenLikes}
            onClose={onCloseLikes}
            title="Liked By"
            usersList={modifiedLikes}
          />
          <Text fontSize="xs" whiteSpace="pre">
            {' '}
            •{' '}
          </Text>
          <Text
            fontSize="xs"
            _hover={{ textDecoration: 'underline', cursor: 'pointer' }}
            onClick={onOpenComments}
          >
            {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
          </Text>
        </Stack>
      </Flex>
    </Flex>
  );
}
