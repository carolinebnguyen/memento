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
import ErrorComponent from '../../components/ErrorComponent';

export default function Profile() {
  const [profile, setProfile] = useState({});
  const [photos, setPhotos] = useState({});
  const [statuses, setStatuses] = useState({});
  const [pageState, setPageState] = useState('LOADING');
  const [isFollowing, setIsFollowing] = useState(false);

  const { username } = useParams();

  useEffect(() => {
    setPageState('LOADING');
    const fetchUserProfile = async () => {
      try {
        const res = await getUserProfile(username);

        if (!res && res === null) {
          setPageState('NOT_FOUND');
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
        setPageState('DONE');
      } catch (error) {
        setPageState('ERROR');
      }
    };
    fetchUserProfile();
  }, [username]);

  if (pageState === 'LOADING') {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  } else if (pageState === 'NOT_FOUND') {
    return <ErrorComponent errorType="USER" />;
  } else if (pageState === 'ERROR') {
    return <ErrorComponent errorType="SERVER" />;
  }
  return (
    <Flex direction="column" align="center" w="100%">
      <ProfileHeader profile={profile} isFollowingUser={isFollowing} />
      <Flex justify="center" align="center" w="100%">
        <Tabs align="center" w="90vw">
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
    </Flex>
  );
}
