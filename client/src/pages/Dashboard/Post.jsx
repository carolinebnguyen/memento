import React, { useEffect, useState } from 'react';
import { Center, Flex, Spinner } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import PostContent from '../../components/PostContent';
import PostNotFound from '../../components/PostNotFound';
import { getPost } from '../../utils/postUtils';

export default function Post() {
  const { postId } = useParams();

  const [post, setPost] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchPost = async () => {
      const res = await getPost(postId);

      if (!res && res === null) {
        setPost(null);
        setIsLoading(false);
        return;
      }

      setPost(res);
      setIsLoading(false);
    };
    fetchPost();
  }, [postId]);

  return (
    <Flex direction="column" justify="center" align="center">
      {isLoading ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        <>{!post ? <PostNotFound /> : <PostContent post={post} />}</>
      )}
    </Flex>
  );
}
