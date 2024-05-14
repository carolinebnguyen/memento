import React from 'react';
import {
  Box,
  Button,
  Text,
  Flex,
  Image,
  Heading,
  VStack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import userNotFoundDog from '../assets/userNotFoundDog.jpg';

export default function UserNotFound() {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <Flex direction="column" h="100%">
      <Flex direction="column">
        <Box align="center" justify="center" p={5}>
          <Heading as="h1" size="4xl">
            404
          </Heading>
          <Text fontSize="5xl">User Not Found</Text>
          <Text fontSize="xl">Oops! No account with that username exists.</Text>
          <Button m={5} colorScheme="blue" onClick={handleBackClick}>
            Go Back
          </Button>
        </Box>
        <VStack>
          <Image
            src={userNotFoundDog}
            boxSize="500px"
            objectFit="cover"
            objectPosition="center"
            alt="Pomeranian with Scarf"
          />
          <Text as="i">Source: RudyPongki</Text>
        </VStack>
      </Flex>
    </Flex>
  );
}
