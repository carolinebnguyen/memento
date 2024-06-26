import React, { useCallback, useEffect, useState } from 'react';
import {
  Flex,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Center,
  Spinner,
} from '@chakra-ui/react';
import { AllTab, PhotoTab, StatusTab } from '../../components/Tabs';
import HomePostTabContent from '../../components/HomePostTabContent';
import {
  getAllHomeFeedPosts,
  sortPostsByType,
  PostType,
} from '../../utils/postUtils';
import ErrorComponent from '../../components/ErrorComponent';

export default function Home() {
  const [allPosts, setAllPosts] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [pageState, setPageState] = useState('LOADING');

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const allPosts = await getAllHomeFeedPosts();
        const { photos, statuses } = sortPostsByType(allPosts);
        setAllPosts(allPosts);
        setPhotos(photos);
        setStatuses(statuses);
        setPageState('DONE');
      } catch (error) {
        setPageState('ERROR');
      }
    };
    fetchAllPosts();
  }, []);

  const handleDeletePost = useCallback(
    (postId) => {
      const updatedAllPosts = allPosts.filter((post) => post.postId !== postId);
      setAllPosts(updatedAllPosts);

      const updatedPhotos = updatedAllPosts.filter(
        (post) => post.type === PostType.PHOTO
      );
      setPhotos(updatedPhotos);

      const updatedStatuses = updatedAllPosts.filter(
        (post) => post.type === PostType.STATUS
      );
      setStatuses(updatedStatuses);
    },
    [allPosts]
  );

  switch (pageState) {
    case 'LOADING':
      return (
        <Center>
          <Spinner />
        </Center>
      );
    case 'ERROR':
      return <ErrorComponent errorType="SERVER" />;
    default:
      return (
        <Flex justify="center" align="center" w={{ base: '90vw', sm: '100vw' }}>
          <Tabs align="center" w="100%">
            <TabList role="tablist">
              <AllTab>All</AllTab>
              <PhotoTab>Photos</PhotoTab>
              <StatusTab>Statuses</StatusTab>
            </TabList>
            <TabPanels>
              <TabPanel role="tabpanel">
                <HomePostTabContent
                  postList={allPosts}
                  postType={PostType.POST}
                  onPostDelete={handleDeletePost}
                />
              </TabPanel>
              <TabPanel role="tabpanel">
                <HomePostTabContent
                  postList={photos}
                  postType={PostType.PHOTO}
                  onPostDelete={handleDeletePost}
                />
              </TabPanel>
              <TabPanel role="tabpanel">
                <HomePostTabContent
                  postList={statuses}
                  postType={PostType.STATUS}
                  onPostDelete={handleDeletePost}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Flex>
      );
  }
}
