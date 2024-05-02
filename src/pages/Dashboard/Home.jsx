import React from 'react';
import { Flex, Tabs, TabList, TabPanels, TabPanel } from '@chakra-ui/react';
import { AllTab, PhotoTab, StatusTab } from '../../components/Tabs';

export default function Home() {
  return (
    <Flex justify="center" align="center" w="100%">
      <Tabs align="center" w="100vw">
        <TabList role="tablist">
          <AllTab>All</AllTab>
          <PhotoTab>Photos</PhotoTab>
          <StatusTab>Statuses</StatusTab>
        </TabList>
        <TabPanels>
          <TabPanel role="tabpanel">All Tab</TabPanel>
          <TabPanel role="tabpanel">Photo 1</TabPanel>
          <TabPanel role="tabpanel">Status 1</TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}
