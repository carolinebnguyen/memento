import React, { useEffect, useState } from 'react';
import {
  Flex,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Spinner,
} from '@chakra-ui/react';
import { PhotoTab, StatusTab } from '../../components/Tabs';
import ProfileHeader from '../../components/ProfileHeader';
import ProfilePhotoTabContent from '../../components/ProfilePhotoTabContent';
import ProfileStatusTabContent from '../../components/ProfileStatusTabContent';
import { getCurrentUserProfile } from '../../utils/userUtils';
import { sortPostsByType } from '../../utils/postUtils';

export default function Profile() {
  const [currentProfile, setCurrentProfile] = useState({});
  const [photos, setPhotos] = useState({});
  const [statuses, setStatuses] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchCurrentProfile = async () => {
      const { user, posts } = await getCurrentUserProfile();
      const { photos, statuses } = sortPostsByType(posts);
      const fullProfileInfo = {
        ...user,
        photoCount: photos.length,
        statusCount: statuses.length,
      };
      setCurrentProfile(fullProfileInfo);
      setPhotos(photos);
      setStatuses(statuses);
      setIsLoading(false);
    };
    fetchCurrentProfile();
  }, []);

  return (
    <Flex direction="column" align="center" w="100%">
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <ProfileHeader profile={currentProfile} />
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
