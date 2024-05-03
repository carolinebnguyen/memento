import React from 'react';
import { Flex } from '@chakra-ui/react';
import { PostType } from '../utils/utils';
import PhotoCard from './PhotoCard';
import StatusCard from './StatusCard';

export default function PostContent({ post }) {
  const { type } = post;
  return (
    <Flex direction="column" justify="center" align="center" w="100%">
      {type === PostType.PHOTO ? (
        <PhotoCard photo={post} />
      ) : (
        <StatusCard status={post} />
      )}
    </Flex>
  );
}
