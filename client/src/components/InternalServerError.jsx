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
import serverErrorCat from '../assets/serverErrorCat.jpg';

export default function InternalServerError() {
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
            500
          </Heading>
          <Text fontSize="5xl">Internal Server Error</Text>
          <Text fontSize="xl">
            Oops! We're experiencing technical difficulties. Please try again
            later.
          </Text>
          <Button m={5} colorScheme="blue" onClick={handleBackClick}>
            Go Back
          </Button>
        </Box>
        <VStack>
          <Image
            src={serverErrorCat}
            boxSize="500px"
            objectFit="cover"
            objectPosition="center"
            alt="Cat with glasses sitting at laptop"
          />
        </VStack>
      </Flex>
    </Flex>
  );
}
