import React from 'react';
import { Flex, Text, Avatar, Button, HStack, Stack } from '@chakra-ui/react';

export default function UserCard({ user }) {
  const { username, name, picture } = user;

  return (
    <Flex justify="space-between">
      <HStack>
        <Avatar size="md" src={picture} />
        <Stack direction="column" gap={0}>
          <Text as="b">{username}</Text>
          <Text fontSize="sm" color="gray" fontWeight={500}>
            {name}
          </Text>
        </Stack>
      </HStack>
      <Button>Follow</Button>
    </Flex>
  );
}
