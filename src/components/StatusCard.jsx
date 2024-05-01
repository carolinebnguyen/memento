import React from 'react';
import { Flex, Button, Text, Avatar, Heading, Stack } from '@chakra-ui/react';
import { FaRegHeart, FaRegComment, FaEllipsis } from 'react-icons/fa6';
import { MdOutlineIosShare } from 'react-icons/md';

export default function StatusCard({ username, picture }) {
  return (
    <>
      <Flex justify="space-between">
        <Stack direction="row" align="center" gap={2}>
          <Avatar size="xs" src={picture} />
          <Heading as="h2" size="xs" noOfLines={1}>
            {username}
          </Heading>
          <Text fontSize="xs">2 days ago</Text>
        </Stack>
        <Button size="xs" colorScheme="whiteAlpha">
          <FaEllipsis size={16} color="gray" />
        </Button>
      </Flex>
      <Text fontSize="sm" my={2} textAlign="left">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora quasi,
        nemo, quos at beatae corrupti aspernatur ab fugit, laudantium magni
        velit necessitatibus perspiciatis placeat totam quisquam. Quo provident
        eaque nihil.
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
    </>
  );
}
