import React, { useEffect } from 'react';
import axios from 'axios';
import { Flex, Tabs, TabList, TabPanels, TabPanel } from '@chakra-ui/react';
import { AllTab, PhotoTab, StatusTab } from '../../components/Tabs';
import HomePostTabContent from '../../components/HomePostTabContent';
import { categorizedPosts } from '../../utils/testData';
import { PostType } from '../../utils/utils';

export default function Home() {
  const { all, photos, statuses } = categorizedPosts;

  useEffect(() => {
    // TODO: REMOVE testApi
    const testApi = async () => {
      try {
        const test = await axios.get('/api/test');
        console.log(test);
      } catch (err) {
        console.log(err);
      }
    };
    testApi();
  }, []);

  return (
    <Flex justify="center" align="center" w="100%">
      <Tabs align="center" w="100vw">
        <TabList role="tablist">
          <AllTab>All</AllTab>
          <PhotoTab>Photos</PhotoTab>
          <StatusTab>Statuses</StatusTab>
        </TabList>
        <TabPanels>
          <TabPanel role="tabpanel">
            <HomePostTabContent postList={all} postType={[PostType.POST]} />
          </TabPanel>
          <TabPanel role="tabpanel">
            <HomePostTabContent postList={photos} postType={[PostType.PHOTO]} />
          </TabPanel>
          <TabPanel role="tabpanel">
            <HomePostTabContent
              postList={statuses}
              postType={[PostType.STATUS]}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}
