import React from 'react';
import {
  Avatar,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
  Stack,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Text,
} from '@chakra-ui/react';
import { FaRegHeart, FaRegComment, FaEllipsis } from 'react-icons/fa6';
import { LuShare } from 'react-icons/lu';
import { PostTab, StatusTab } from '../../components/Tabs';
import ProfileHeader from '../../components/ProfileHeader';
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
            <Flex justify="space-between">
              <Stack direction="row" align="center" gap={2}>
                <Avatar size="xs" src={caroline} />
                <Heading as="h2" size="xs" noOfLines={1}>
                  carolibn
                </Heading>
                <Text fontSize="xs">2 days ago</Text>
              </Stack>

              <Button size="xs" colorScheme="whiteAlpha">
                <FaEllipsis size={16} color="gray" />
              </Button>
            </Flex>

            <Text fontSize="sm" mt={2}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora
              quasi, nemo, quos at beatae corrupti aspernatur ab fugit,
              laudantium magni velit necessitatibus perspiciatis placeat totam
              quisquam. Quo provident eaque nihil.
            </Text>

            <Stack direction="row" gap={0}>
              <Button size="xs" colorScheme="whiteAlpha">
                <FaRegHeart size={16} color="gray" />
              </Button>
              <Button size="xs" colorScheme="whiteAlpha">
                <FaRegComment size={16} color="gray" />
              </Button>
              <Button size="xs" colorScheme="whiteAlpha">
                <LuShare size={16} color="gray" />
              </Button>
            </Stack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}
