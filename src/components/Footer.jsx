import React from 'react';
import { Flex, Text, Spacer } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <>
      <Spacer height="50px" />
      <Flex
        bg="blue.400"
        color="white"
        justify="space-between"
        p={4}
        position="fixed"
        bottom="0"
        left="0"
        right="0"
        zIndex="9999"
        w="100%"
      >
        <Text>© 2024 Memento</Text>
        <Flex>
          <Link to="/about" style={{ marginRight: '10px' }}>
            About
          </Link>
          <Link to="/terms" style={{ marginRight: '10px' }}>
            Terms
          </Link>
          <Link to="/privacy" style={{ marginRight: '10px' }}>
            Privacy
          </Link>
          <Link to="/contact">Contact</Link>
        </Flex>
      </Flex>
    </>
  );
}
