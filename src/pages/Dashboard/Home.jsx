import React from 'react';
import { Flex } from '@chakra-ui/react';
import { sidebarWidth } from '../../utils/constants';

export default function Home() {
  return (
    <>
      <Flex justify="center" align="center" ml={sidebarWidth}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora quasi,
        nemo, quos at beatae corrupti aspernatur ab fugit, laudantium magni
        velit necessitatibus perspiciatis placeat totam quisquam. Quo provident
        eaque nihil.
      </Flex>
    </>
  );
}
