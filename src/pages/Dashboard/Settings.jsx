import React from 'react';
import {
  Flex,
  Heading,
  Card,
  CardHeader,
  CardBody,
  Stack,
  Divider,
  Box,
} from '@chakra-ui/react';
import ProfileInfoCard from '../../components/ProfileInfoCard';
import AccountInfoCard from '../../components/AccountInfoCard';

export default function Settings() {
  return (
    <Flex w="100%">
      <Card w={{ sm: '100vw', md: '60vw', xl: '40vw' }}>
        <CardHeader textAlign="center">
          <Heading as="h1" size="md">
            Settings
          </Heading>
        </CardHeader>
        <CardBody>
          <Stack divider={<Divider />} spacing={4}>
            <ProfileInfoCard />
            <Box>
              <AccountInfoCard />
            </Box>
          </Stack>
        </CardBody>
      </Card>
    </Flex>
  );
}
