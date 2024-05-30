import { Avatar, Flex, HStack, Heading } from '@chakra-ui/react';
import React from 'react';
import { NavLink } from 'react-router-dom';

export default function ConversationHeader({ partner }) {
  const { username, picture } = partner;
  return (
    <Flex
      align="center"
      position="fixed"
      bgColor="white"
      ml={1}
      borderBottomWidth="1px"
      borderColor="blackAlpha.300"
      w="100vw"
      mt={2}
    >
      <NavLink to={`/profile/${username}`}>
        <HStack
          p={2}
          _hover={{
            backgroundColor: '#e2f4f6',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
          ml={3}
          mb={2}
        >
          <Avatar size="md" src={picture} mr={1} />
          <Heading as="h2" size="sm" fontWeight={600} pr={1}>
            {username}
          </Heading>
        </HStack>
      </NavLink>
    </Flex>
  );
}
