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
import postNotFoundDog from '../assets/postNotFoundDog.jpg';

export default function PostNotFound() {
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
          <Text fontSize="5xl">Post Not Found</Text>
          <Text fontSize="xl">Oops! No post with that ID exists.</Text>
          <Button m={5} colorScheme="blue" onClick={handleBackClick}>
            Go Back
          </Button>
        </Box>
        <VStack>
          <Image
            src={postNotFoundDog}
            boxSize="500px"
            objectFit="cover"
            objectPosition="center"
            alt="Pomeranian with Santa hat"
          />
          <Text as="i">Source: RudyPongki</Text>
        </VStack>
      </Flex>
    </Flex>
  );
}
