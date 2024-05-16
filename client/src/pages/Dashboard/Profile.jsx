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
import { checkIsFollowing, getUserProfile } from '../../utils/userUtils';
import { sortPostsByType } from '../../utils/postUtils';
import { useParams } from 'react-router-dom';
import UserNotFound from '../../components/UserNotFound';

export default function Profile() {
  const [profile, setProfile] = useState({});
  const [photos, setPhotos] = useState({});
  const [statuses, setStatuses] = useState({});
  const [profileState, setProfileState] = useState('LOADING');
  const [isFollowing, setIsFollowing] = useState(false);

  const { username } = useParams();

  useEffect(() => {
    setProfileState('LOADING');
    const fetchUserProfile = async () => {
      try {
        const res = await getUserProfile(username);

        if (!res && res === null) {
          setProfileState('NOT_FOUND');
          return;
        }

        const isFollowingUser = await checkIsFollowing(username);
        setIsFollowing(isFollowingUser);

        const { user, posts } = res;
        const { photos, statuses } = sortPostsByType(posts);
        const fullProfileInfo = {
          ...user,
          photoCount: photos.length,
          statusCount: statuses.length,
        };
        setProfile(fullProfileInfo);
        setPhotos(photos);
        setStatuses(statuses);
        setProfileState('DONE');
      } catch (error) {
        setProfileState('NOT_FOUND');
      }
    };
    fetchUserProfile();
  }, [username]);

  return (
    <Flex direction="column" align="center" w="100%">
      {profileState === 'LOADING' ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        <>
          {profileState === 'NOT_FOUND' ? (
            <UserNotFound />
          ) : (
            <>
              <ProfileHeader profile={profile} isFollowingUser={isFollowing} />
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
        </>
      )}
    </Flex>
  );
}
