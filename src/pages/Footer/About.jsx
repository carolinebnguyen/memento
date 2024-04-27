import React from 'react';
import { Flex, Heading, Stack, Text, Image } from '@chakra-ui/react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import caroline from '../../assets/carolineAvatar.png';
import snowie from '../../assets/snowieAvatar.png';

export default function About() {
  return (
    <>
      <Navbar />
      <Flex justify="center" pt={16} h="100vh">
        <Stack align="center" minW={{ base: '100%', lg: '50%', xl: '30%' }}>
          <Stack padding={9} align="center" maxW={{ base: '100%', lg: '50%' }}>
            <Heading as="h1" size="2xl">
              About Us
            </Heading>
            <Text>
              {' '}
              Memento is an engaging social media platform focused on sharing
              precious moments through photos and text statuses. Users are the
              authors of their digital life stories as they share their
              experiences and memories with the world.
            </Text>
            <Heading as="h2" size="xl" mt={5}>
              Our Mission
            </Heading>
            <Text>
              {' '}
              At Memento, our mission is to foster a community built on
              authenticity and connection by empowering individuals to capture
              and share treasured moments of their lives.
            </Text>
            <Heading as="h2" size="xl" mt={5}>
              Our Team
            </Heading>
            <Heading as="h3" size="md" mt={5}>
              Caroline Nguyen
            </Heading>
            <Image src={caroline} boxSize="250px" my={2} />
            <Text as="i">Developer</Text>
            <Heading as="h3" size="md" mt={5}>
              Snowie
            </Heading>
            <Image src={snowie} boxSize="250px" my={2} />
            <Text as="i">CEO, COO, CFO, CTO</Text>
          </Stack>
        </Stack>
      </Flex>
      <Footer />
    </>
  );
}
