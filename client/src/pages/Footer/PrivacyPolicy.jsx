import React from 'react';
import {
  Flex,
  Heading,
  Stack,
  Text,
  UnorderedList,
  ListItem,
} from '@chakra-ui/react';

export default function PrivacyPolicy() {
  return (
    <Flex justify="center" pt={16} h="auto">
      <Stack align="center" minW={{ base: '100%', lg: '50%', xl: '30%' }}>
        <Stack padding={9} maxW={{ base: '100%', lg: '50%' }}>
          <Heading as="h1" size="2xl" align="center" mb={5}>
            Privacy Policy
          </Heading>
          <Text>
            At Memento, our visitors' privacy is one of our top priorities. This
            Privacy Policy explains how we collect and use your information.
          </Text>
          <Heading as="h2" size="xl" my={5}>
            Information We Collect
          </Heading>
          <Text>
            We collect certain personally identifiable information necessary for
            your usage of the website. This information may include, but is not
            limited to:
          </Text>
          <UnorderedList>
            <ListItem>Your email address</ListItem>
            <ListItem>Your first and last name</ListItem>
          </UnorderedList>
          <Heading as="h2" size="xl" my={5}>
            How We Use Your Information
          </Heading>
          <Text>
            We use your information to provide you with a personalized
            experience, ensure your account security, and communicate with you.
          </Text>
          <Heading as="h2" size="xl" my={5}>
            Updating Privacy Policy
          </Heading>
          <Text>
            We reserve the right to modify this policy at any time. We will
            notify you before the updated Privacy Policy goes into effect, and
            you will have the chance to review any changes before they become
            effective. If you continue to use Memento after these updates, you
            will be subject to the revised policy.
          </Text>
        </Stack>
      </Stack>
    </Flex>
  );
}
