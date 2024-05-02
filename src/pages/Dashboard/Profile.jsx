import React from 'react';
import { Flex, Tabs, TabList, TabPanels, TabPanel } from '@chakra-ui/react';
import { PhotoTab, StatusTab } from '../../components/Tabs';
import ProfileHeader from '../../components/ProfileHeader';
import ProfilePhotoTabContent from '../../components/ProfilePhotoTabContent';
import StatusTabContent from '../../components/StatusTabContent';
import { getProfile } from '../../utils/testData';
import { useLocation } from 'react-router-dom';

export default function Profile() {
  const { search } = useLocation();
  const username = new URLSearchParams(search).get('username');
  const profile = getProfile(username);

  return (
    <Flex direction="column" align="center" w="100%">
      <ProfileHeader profile={profile} />
      <Flex justify="center" align="center" w="100%">
        <Tabs align="center" w="100vw">
          <TabList role="tablist">
            <PhotoTab>Photos</PhotoTab>
            <StatusTab>Statuses</StatusTab>
          </TabList>
          <TabPanels>
            <TabPanel role="tabpanel">
              <ProfilePhotoTabContent profile={profile} />
            </TabPanel>
            <TabPanel role="tabpanel">
              <StatusTabContent profile={profile} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </Flex>
  );
}
