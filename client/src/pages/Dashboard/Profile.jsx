import React, { useEffect, useState } from 'react';
import {
  Flex,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { PhotoTab, StatusTab } from '../../components/Tabs';
import ProfileHeader from '../../components/ProfileHeader';
import ProfilePhotoTabContent from '../../components/ProfilePhotoTabContent';
import ProfileStatusTabContent from '../../components/ProfileStatusTabContent';
import { getUserProfile } from '../../utils/userUtils';
import { sortPostsByType } from '../../utils/postUtils';
import { useLocation } from 'react-router-dom';

export default function Profile() {
  const [profile, setProfile] = useState({});
  const [photos, setPhotos] = useState({});
  const [statuses, setStatuses] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { search } = useLocation();
  const username = new URLSearchParams(search).get('username');

  useEffect(() => {
    setIsLoading(true);
    const fetchUserProfile = async () => {
      const { user, posts } = await getUserProfile(username);
      const { photos, statuses } = sortPostsByType(posts);
      const fullProfileInfo = {
        ...user,
        photoCount: photos.length,
        statusCount: statuses.length,
      };
      setProfile(fullProfileInfo);
      setPhotos(photos);
      setStatuses(statuses);
      setIsLoading(false);
    };
    fetchUserProfile();
  }, [username]);

  return (
    <Flex direction="column" align="center" w="100%">
      {isLoading ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        <>
          <ProfileHeader profile={profile} />
          <Flex justify="center" align="center" w="100%">
            <Tabs align="center" w="100vw">
              <TabList role="tablist">
                <PhotoTab>Photos</PhotoTab>
                <StatusTab>Statuses</StatusTab>
              </TabList>
              <TabPanels>
                <TabPanel role="tabpanel">
                  <ProfilePhotoTabContent photos={photos} />
                </TabPanel>
                <TabPanel role="tabpanel">
                  <ProfileStatusTabContent statuses={statuses} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Flex>
        </>
      )}
    </Flex>
  );
}
