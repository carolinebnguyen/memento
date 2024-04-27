import React from 'react';
import {
  Box,
  Button,
  Text,
  Flex,
  Image,
  Grid,
  GridItem,
  Heading,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import notFoundDog from '../assets/notFoundDog.jpg';

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <Flex align="center" justify="center" h="100vh">
      <Grid
        templateColumns={{ md: 'repeat(2, 1fr)' }}
        templateRows={{ base: 'repeat(2, 1fr)', md: 'none' }}
        columnGap={20}
      >
        <GridItem w="100%" h={{ base: '50vh', md: '100vh' }}>
          <Flex align="center" justify="center" h="100%">
            <Box align="center" justify="center" p={5}>
              <Heading as="h1" size="4xl">
                404
              </Heading>
              <Text fontSize="5xl">Page Not Found</Text>
              <Text fontSize="xl">
                Oops! The page you are looking for was not found.
              </Text>
              <Button m={5} colorScheme="blue" onClick={() => navigate('/')}>
                Back to Home
              </Button>
            </Box>
          </Flex>
        </GridItem>
        <GridItem w="100%" h={{ base: '50vh', md: '100vh' }}>
          <Flex
            align="center"
            justify="center"
            h="100%"
            direction="column"
            p={5}
          >
            <Image
              src={notFoundDog}
              boxSize="500px"
              objectFit="cover"
              objectPosition="center"
              alt="Pomeranian with Santa hat"
            />
            <Text as="i">Source: missyminzi</Text>
          </Flex>
        </GridItem>
      </Grid>
    </Flex>
  );
}
