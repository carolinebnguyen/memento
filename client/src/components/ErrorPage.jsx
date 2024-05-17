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
import notFoundDog from '../assets/notFoundDog.jpg';

export default function ErrorPage() {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <Flex align="center" justify="center" h="100vh" direction="column">
      <Flex direction="column">
        <Box align="center" justify="center" p={5}>
          <Heading as="h1" size="4xl">
            404
          </Heading>
          <Text fontSize="5xl">Page Not Found</Text>
          <Text fontSize="xl">
            Oops! The page you are looking for could not be found.
          </Text>
          <Button m={5} colorScheme="blue" onClick={handleBackClick}>
            Go Back
          </Button>
        </Box>
        <VStack>
          <Image
            src={notFoundDog}
            boxSize="500px"
            objectFit="cover"
            objectPosition="center"
            alt="Pomeranian with Santa hat"
          />
          <Text as="i">Source: missyminzi</Text>
        </VStack>
      </Flex>
    </Flex>
  );
}
