import React from 'react';
import { Avatar, Button, Flex, Heading, Stack, Text } from '@chakra-ui/react';

export default function ProfileHeader() {
  return (
    <Flex>
      <Avatar
        size="xl"
        mr={5}
        name="Caroline Nguyen"
        bg="teal.500"
        src="https://media.tenor.com/mbsKdEmx9V0AAAAe/bubu-cute-bubu-adorable.png"
      />
      <Stack direction="column">
        <Stack direction="row" gap={5}>
          <Heading as="h1" size="md" noOfLines={1}>
            carolibn
          </Heading>
          <Button colorScheme="blue" size="xs">
            Edit Profile
          </Button>
        </Stack>

        <Stack direction="row" gap={10}>
          <Text as="b" fontSize="sm">
            4 posts
          </Text>
          <Text as="b" fontSize="sm">
            1234 followers
          </Text>
          <Text as="b" fontSize="sm">
            56 following
          </Text>
        </Stack>

        <Heading as="h2" size="xs" noOfLines={1}>
          Caroline Nguyen
        </Heading>

        <Text fontSize="sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora
          quasi, nemo, quos at beatae corrupti aspernatur ab fugit, laudantium
          magni velit necessitatibus perspiciatis placeat totam quisquam. Quo
          provident eaque nihil.
        </Text>
      </Stack>
    </Flex>
  );
}
