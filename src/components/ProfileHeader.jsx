import React from 'react';
import { Avatar, Button, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export default function ProfileHeader({ username, name, picture }) {
  return (
    <Flex mb={4}>
      <Avatar size="xl" mr={5} src={picture} />
      <Stack direction="column">
        <Stack direction="row" gap={5}>
          <Heading as="h1" size="md" noOfLines={1}>
            {username}
          </Heading>
          <Link to="/settings">
            <Button colorScheme="blue" size="xs">
              Edit Profile
            </Button>
          </Link>
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
          {name}
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
