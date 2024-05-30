import React from 'react';
import { Flex, Text, Avatar, HStack, Stack, Link } from '@chakra-ui/react';

export default function UserSearchResultCard({ user }) {
  const { username, name, picture } = user;

  return (
    <Flex
      justify="space-between"
      align="center"
      _hover={{ backgroundColor: '#f5fbfc', cursor: 'pointer' }}
      p={2}
    >
      <HStack>
        <Avatar size="sm" src={picture} />
        <Stack direction="column" gap={0}>
          <Link color="black">
            <Text as="b">{username}</Text>
          </Link>
          <Text fontSize="sm" color="gray" fontWeight={500}>
            {name}
          </Text>
        </Stack>
      </HStack>
    </Flex>
  );
}
