import React from 'react';
import { Flex, Tabs, TabList, TabPanels, TabPanel } from '@chakra-ui/react';
import { AllTab, PhotoTab, StatusTab } from '../../components/Tabs';
import HomePostTabContent from '../../components/HomePostTabContent';
import { PostType } from '../../utils/utils';

export default function Home() {
  const all = [];
  const photos = [];
  const statuses = [];

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
            <HomePostTabContent postList={all} postType={PostType.POST} />
          </TabPanel>
          <TabPanel role="tabpanel">
            <HomePostTabContent postList={photos} postType={PostType.PHOTO} />
          </TabPanel>
          <TabPanel role="tabpanel">
            <HomePostTabContent
              postList={statuses}
              postType={PostType.STATUS}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}
