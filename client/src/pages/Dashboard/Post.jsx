import React from 'react';
import { Flex } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import PostContent from '../../components/PostContent';
import PostNotFound from '../../components/PostNotFound';
import { getPost } from '../../utils/testData';

export default function Post() {
  const { search } = useLocation();
  const searchedId = new URLSearchParams(search).get('id');
  const post = getPost(searchedId);

  return (
    <Flex direction="column" justify="center" align="center">
      {!post ? <PostNotFound /> : <PostContent post={post} />}
    </Flex>
  );
}
