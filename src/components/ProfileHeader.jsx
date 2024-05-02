import React from 'react';
import {
  Avatar,
  Button,
  Flex,
  Heading,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import FollowModal from './FollowModal';

export default function ProfileHeader({ username, name, picture }) {
  const {
    isOpen: isOpenFollower,
    onOpen: onOpenFollower,
    onClose: onCloseFollower,
  } = useDisclosure();
  const {
    isOpen: isOpenFollowing,
    onOpen: onOpenFollowing,
    onClose: onCloseFollowing,
  } = useDisclosure();

  return (
    <Flex mb={2}>
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

        <Stack direction="row" gap={10} mt={2}>
          <Stack
            direction={{ base: 'column', sm: 'row' }}
            gap={{ base: 0, sm: 1 }}
            align="center"
          >
            <Text as="b" fontSize="sm">
              4
            </Text>
            <Text fontSize="sm" fontWeight={500}>
              posts
            </Text>
          </Stack>
          <Stack
            direction={{ base: 'column', sm: 'row' }}
            gap={{ base: 0, sm: 1 }}
            align="center"
            _hover={{ textDecoration: 'underline', cursor: 'pointer' }}
            onClick={onOpenFollower}
          >
            <Text fontSize="sm">
              <Text as="b">1,234</Text> followers
            </Text>
            <FollowModal
              isOpen={isOpenFollower}
              onClose={onCloseFollower}
              title="Followers"
            />
          </Stack>
          <Stack
            direction={{ base: 'column', sm: 'row' }}
            gap={{ base: 0, sm: 1 }}
            align="center"
            _hover={{ textDecoration: 'underline', cursor: 'pointer' }}
            onClick={onOpenFollowing}
          >
            <Text fontSize="sm">
              <Text as="b">56</Text> following
            </Text>
          </Stack>
          <FollowModal
            isOpen={isOpenFollowing}
            onClose={onCloseFollowing}
            title="Following"
          />
        </Stack>

        <Heading as="h2" size="xs" noOfLines={1} my={2}>
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
