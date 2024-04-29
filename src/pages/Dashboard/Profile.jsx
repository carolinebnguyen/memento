import React from 'react';
import { Flex, Tabs, TabList, TabPanels, TabPanel } from '@chakra-ui/react';
import { PostTab, StatusTab } from '../../components/Tabs';
import ProfileHeader from '../../components/ProfileHeader';

export default function Profile() {
  return (
    <Flex justify="center" align="center" direction="column">
      <ProfileHeader />
      <Tabs>
        <TabList>
          <PostTab>Posts</PostTab>
          <StatusTab>Statuses</StatusTab>
        </TabList>
        <TabPanels>
          <TabPanel>Post 1</TabPanel>
          <TabPanel>Status 1</TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}
