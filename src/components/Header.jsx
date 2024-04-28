import React from 'react';
import { Flex, Box } from '@chakra-ui/react';

export default function Header() {
  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      w="full"
      px={5}
      borderBottomWidth="1px"
      borderColor="blackAlpha.300"
      h={14}
    >
      <Box>Header</Box>
    </Flex>
  );
}
