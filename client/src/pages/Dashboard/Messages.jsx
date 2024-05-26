import React, { useEffect, useState } from 'react';
import { Flex, Spinner, Center, Heading } from '@chakra-ui/react';

import ErrorComponent from '../../components/ErrorComponent';

export default function Messages() {
  const [pageState, setPageState] = useState('LOADING');

  useEffect(() => {
    setPageState('LOADING');
    setPageState('DONE');
  }, []);

  if (pageState === 'LOADING') {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  } else if (pageState === 'ERROR') {
    return <ErrorComponent errorType="SERVER" />;
  }

  return (
    <Flex direction="column" align="center" w="100%">
      <Heading as="h1" size="lg" mb={2}>
        Messages
      </Heading>
    </Flex>
  );
}
