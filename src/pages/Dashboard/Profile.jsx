import React from 'react';
import { Flex, Tabs, TabList, TabPanels, TabPanel } from '@chakra-ui/react';
import { PostTab, StatusTab } from '../../components/Tabs';
import ProfileHeader from '../../components/ProfileHeader';
import ProfilePostTabContent from '../../components/ProfilePostTabContent';
import StatusTabContent from '../../components/StatusTabContent';
import { carolineProfile } from '../../utils/testData';

export default function Profile() {
  return (
    <Flex justify="center" align="center" direction="column">
      <ProfileHeader profile={carolineProfile} />
      <Tabs align="center" w="100%">
        <TabList role="tablist">
          <PostTab>Posts</PostTab>
          <StatusTab>Statuses</StatusTab>
        </TabList>
        <TabPanels>
          <TabPanel role="tabpanel">
            <ProfilePostTabContent user={carolineProfile} />
          </TabPanel>
          <TabPanel role="tabpanel">
            <StatusTabContent user={carolineProfile} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}
