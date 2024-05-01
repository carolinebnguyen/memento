import React from 'react';
import {
  Flex,
  Grid,
  GridItem,
  Image,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Divider,
} from '@chakra-ui/react';
import { PostTab, StatusTab } from '../../components/Tabs';
import ProfileHeader from '../../components/ProfileHeader';
import StatusCard from '../../components/StatusCard';
import caroline from '../../assets/placeholders/carolineAvatarClear.png';

export default function Profile() {
  return (
    <Flex justify="center" align="center" direction="column">
      <ProfileHeader
        username="carolibn"
        name="Caroline Nguyen"
        picture={caroline}
      />
      <Tabs align="center">
        <TabList role="tablist">
          <PostTab>Posts</PostTab>
          <StatusTab>Statuses</StatusTab>
        </TabList>
        <TabPanels>
          <TabPanel role="tabpanel">
            <Grid templateColumns="repeat(3, 1fr)" gap={2}>
              <GridItem border="2px" borderColor="gray.200">
                <Image
                  boxSize="150px"
                  objectFit="cover"
                  src="https://m.media-amazon.com/images/I/51b0f7Fz4KL._AC_UF1000,1000_QL80_.jpg"
                />
              </GridItem>
              <GridItem border="2px" borderColor="gray.200">
                <Image
                  boxSize="150px"
                  objectFit="cover"
                  src="https://getbubududu.com/wp-content/uploads/2023/09/Buy-Bubu-Dudu-Plushies-1.png"
                />
              </GridItem>
              <GridItem border="2px" borderColor="gray.200">
                <Image
                  boxSize="150px"
                  objectFit="cover"
                  src="https://yt3.googleusercontent.com/AHOOH_DO8a-ZLJ9K9lsKyKpCx6ZGfYGy9u-gR7K_932BfXaNkzwfnvqhkNecgAkjoQtA9q6UHg=s900-c-k-c0x00ffffff-no-rj"
                />
              </GridItem>
              <GridItem border="2px" borderColor="gray.200">
                <Image
                  boxSize="150px"
                  objectFit="cover"
                  src="https://ih1.redbubble.net/image.3787621272.3825/bg,f8f8f8-flat,750x,075,f-pad,750x1000,f8f8f8.jpg"
                />
              </GridItem>
            </Grid>
          </TabPanel>
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
  );
}
