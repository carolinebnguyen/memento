import React from 'react';
import { Flex } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import PostNotFound from '../../components/PostNotFound';

export default function Post() {
  const { search } = useLocation();
  const searchedId = new URLSearchParams(search).get('id');

  return (
    <>
      <Flex direction="column" justify="center" align="center" w="100%">
        {!searchedId ? <PostNotFound /> : 'Hello'}
      </Flex>
    </>
  );
}
