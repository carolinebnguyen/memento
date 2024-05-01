import React from 'react';
import {
  Flex,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Divider,
} from '@chakra-ui/react';
import { AllTab, PostTab, StatusTab } from '../../components/Tabs';
import StatusCard from '../../components/StatusCard';
import caroline from '../../assets/placeholders/carolineAvatarClear.png';

export default function Home() {
  return (
    <>
      <Flex justify="center" align="center">
        <Tabs align="center">
          <TabList role="tablist">
            <AllTab>All</AllTab>
            <PostTab>Posts</PostTab>
            <StatusTab>Statuses</StatusTab>
          </TabList>
          <TabPanels>
            <TabPanel role="tabpanel">All Tab</TabPanel>
            <TabPanel role="tabpanel">Post 1</TabPanel>
            <TabPanel role="tabpanel">
              <StatusCard username="carolibn" picture={caroline} />
              <Divider my={3} />
              <StatusCard username="carolibn" picture={caroline} />
              <Divider my={3} />
              <StatusCard username="carolibn" picture={caroline} />
              <Divider my={3} />
              <StatusCard username="carolibn" picture={caroline} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </>
  );
}
