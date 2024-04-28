import React from 'react';
import {
  Flex,
  Heading,
  Stack,
  Text,
  UnorderedList,
  ListItem,
} from '@chakra-ui/react';

export default function Terms() {
  return (
    <>
      <Flex justify="center" pt={16} h="auto">
        <Stack align="center" minW={{ base: '100%', lg: '50%', xl: '30%' }}>
          <Stack padding={9} maxW={{ base: '100%', lg: '50%' }}>
            <Heading as="h1" size="2xl" align="center" mb={5}>
              Terms of Use
            </Heading>
            <Text>Welcome to Memento!</Text>
            <Text>
              These Terms of Use (or "Terms") outline the rules for your use of
              Memento. By accessing this website, you hereby accept these terms.
            </Text>
            <Heading as="h2" size="xl" my={5}>
              Terms of Service
            </Heading>
            <UnorderedList>
              <ListItem>
                You must provide accurate information about yourself and use
                your real name on the platform.
              </ListItem>
              <ListItem>
                You are prohibited from using Memento or its content for any
                unlawful purpose.
              </ListItem>
              <ListItem>
                You are prohibited from abusing our services through excessive
                reporting or posting.
              </ListItem>
            </UnorderedList>
            <Heading as="h2" size="xl" my={5}>
              Updating Terms
            </Heading>
            <Text>
              We reserve the right to modify these Terms at any time. We will
              notify you before the updated Terms go into effect. You will have
              the chance to review any changes before they become effective. If
              you continue to use Memento after these updates, you will be
              subject to the revised Terms.
            </Text>
          </Stack>
        </Stack>
      </Flex>
    </>
  );
}
