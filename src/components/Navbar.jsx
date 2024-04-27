import React from 'react';
import { Flex, Image, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
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
      bgColor="whiteAlpha.900"
    >
      <Link to="/">
        <Image src={logo} alt="Memento logo" />
      </Link>
      <Flex gap={{ base: 2, sm: 5 }}>
        <Link to="/">
          <Button variant="outline" ml={{ base: 2, sm: 0 }}>
            Sign In
          </Button>
        </Link>
        <Link to="/signup">
          <Button colorScheme="blue">Sign Up</Button>
        </Link>
      </Flex>
    </Flex>
  );
}
