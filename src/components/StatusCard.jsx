import React from 'react';
import {
  Flex,
  Button,
  Text,
  Avatar,
  Heading,
  Stack,
  Tooltip,
} from '@chakra-ui/react';
import { FaRegHeart, FaRegComment, FaEllipsis } from 'react-icons/fa6';
import { MdOutlineIosShare } from 'react-icons/md';
import { formatDateDistanceToNow, formatDate } from '../utils/utils';

export default function StatusCard({ username, picture, status }) {
  return (
    <Flex direction="column">
      <Flex justify="space-between">
        <Stack direction="row" align="center" gap={2}>
          <Avatar size="xs" src={picture} />
          <Heading as="h2" size="xs" noOfLines={1}>
            {username}
          </Heading>
          <Tooltip
            label={formatDate(status.postedAt)}
            placement="bottom"
            openDelay={500}
          >
            <Text fontSize="xs">
              {formatDateDistanceToNow(status.postedAt)}
            </Text>
          </Tooltip>
        </Stack>
        <Button size="xs" colorScheme="whiteAlpha">
          <FaEllipsis size={16} color="gray" />
        </Button>
      </Flex>
      <Text fontSize="sm" my={2} textAlign="left">
        {status.content}
      </Text>
      <Stack direction="row" gap={0}>
        <Button size="xs" colorScheme="whiteAlpha">
          <FaRegHeart size={16} color="gray" />
        </Button>
        <Button size="xs" colorScheme="whiteAlpha">
          <FaRegComment size={16} color="gray" />
        </Button>
        <Button size="xs" colorScheme="whiteAlpha">
          <MdOutlineIosShare size={16} color="gray" />
        </Button>
      </Stack>
    </Flex>
  );
}
