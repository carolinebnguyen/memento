import React from 'react';
import { Flex, Text, Link } from '@chakra-ui/react';

export default function Footer() {
  return (
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
        <Link href="/about" mr={6}>
          About
        </Link>
        <Link href="/terms" mr={6}>
          Terms
        </Link>
        <Link href="/privacy" mr={6}>
          Privacy
        </Link>
        <Link href="/contact">Contact</Link>
      </Flex>
    </Flex>
  );
}
