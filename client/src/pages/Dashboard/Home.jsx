import React, { useEffect, useState } from 'react';
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
import { PostType } from '../../utils/utils';
import { getAllHomeFeedPosts } from '../../utils/postUtils';
import ErrorPage from '../../components/ErrorPage';

export default function Home() {
  const [allPosts, setAllPosts] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [pageState, setPageState] = useState('LOADING');

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const allPosts = await getAllHomeFeedPosts();
        setAllPosts(allPosts);
        setPageState('DONE');
      } catch (error) {
        setPageState('NOT_FOUND');
      }
    };
    fetchAllPosts();
  }, []);

  return (
    <Flex justify="center" align="center" w="100%">
      {pageState === 'LOADING' ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        <>
          {pageState === 'NOT_FOUND' ? (
            <ErrorPage />
          ) : (
            <>
              <Tabs align="center" w="100vw">
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
                    />
                  </TabPanel>
                  <TabPanel role="tabpanel">
                    <HomePostTabContent
                      postList={photos}
                      postType={PostType.PHOTO}
                    />
                  </TabPanel>
                  <TabPanel role="tabpanel">
                    <HomePostTabContent
                      postList={statuses}
                      postType={PostType.STATUS}
                    />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </>
          )}
        </>
      )}
    </Flex>
  );
}
