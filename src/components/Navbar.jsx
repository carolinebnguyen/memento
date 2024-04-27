import React from 'react';
import { Flex, Image, Button, Link } from '@chakra-ui/react';
import logo from '../assets/logoBlack.png';

export default function Navbar() {
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      padding="1rem"
      position="fixed"
      top="0"
      zIndex="9999"
      w="100%"
    >
      <Link href="/">
        <Image src={logo} alt="Memento logo" />
      </Link>
      <Flex gap={5}>
        <Link href="/">
          <Button variant="outline">Sign In</Button>
        </Link>
        <Link href="/signup">
          <Button colorScheme="blue" mr="2">
            Sign Up
          </Button>
        </Link>
      </Flex>
    </Flex>
  );
}
