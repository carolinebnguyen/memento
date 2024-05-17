import React, { useEffect, useState } from 'react';
import { Center, Flex, Spinner } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import PostContent from '../../components/PostContent';
import PostNotFound from '../../components/PostNotFound';
import { getPost } from '../../utils/postUtils';
import InternalServerError from '../../components/InternalServerError';

export default function Post() {
  const { postId } = useParams();

  const [post, setPost] = useState({});
  const [pageState, setPageState] = useState('LOADING');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await getPost(postId);

        if (!res && res === null) {
          setPost(null);
          setPageState('NOT_FOUND');
          return;
        }

        setPost(res);
        setPageState('DONE');
      } catch (error) {
        setPageState('ERROR');
      }
    };
    fetchPost();
  }, [postId]);

  switch (pageState) {
    case 'LOADING':
      return (
        <Center>
          <Spinner />
        </Center>
      );
    case 'NOT_FOUND':
      return <PostNotFound />;
    case 'ERROR':
      return <InternalServerError />;
    default:
      return (
        <Flex direction="column" justify="center" align="center">
          {pageState === 'LOADING' ? (
            <Center>
              <Spinner />
            </Center>
          ) : (
            <>{!post ? <PostNotFound /> : <PostContent post={post} />}</>
          )}
        </Flex>
      );
  }
}
