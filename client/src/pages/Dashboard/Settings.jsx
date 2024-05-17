import React, { useCallback, useState } from 'react';
import {
  Flex,
  Heading,
  Card,
  CardHeader,
  CardBody,
  Stack,
  Divider,
  Box,
  Center,
  Spinner,
} from '@chakra-ui/react';
import ProfileInfoCard from '../../components/ProfileInfoCard';
import AccountInfoCard from '../../components/AccountInfoCard';
import ErrorComponent from '../../components/ErrorComponent';

export default function Settings() {
  const [pageStatus, setPageStatus] = useState('');

  const setPageState = useCallback(
    (state) => {
      setPageStatus(state);
    },
    [setPageStatus]
  );

  if (pageStatus === 'LOADING') {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  } else if (pageStatus === 'ERROR') {
    return <ErrorComponent errorType="SERVER" />;
  }

  return (
    <Flex w="100%">
      <Card w={{ sm: '100vw', md: '60vw', xl: '40vw' }}>
        <CardHeader textAlign="center">
          <Heading as="h1" size="lg">
            Settings
          </Heading>
        </CardHeader>
        <CardBody>
          <Stack divider={<Divider />} spacing={4}>
            <ProfileInfoCard setPageState={setPageState} />
            <Box>
              <AccountInfoCard />
            </Box>
          </Stack>
        </CardBody>
      </Card>
    </Flex>
  );
}
