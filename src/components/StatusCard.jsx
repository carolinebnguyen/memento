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
} from '@chakra-ui/react';
import { FaRegHeart, FaHeart, FaRegComment, FaEllipsis } from 'react-icons/fa6';
import { formatDateDistanceToNow, formatDate } from '../utils/utils';

export default function StatusCard({ username, picture, status }) {
  const [isLiked, setIsLiked] = useState(false);
  const { content, postedAt } = status;

  const toggleIsLiked = () => {
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
    </Flex>
  );
}
