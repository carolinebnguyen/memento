import React from 'react';
import { Text, Grid, Box, Flex } from '@chakra-ui/react';
import ProfilePhotoCard from './ProfilePhotoCard';

export default function ProfilePhotoTabContent({ profile }) {
  const { photos } = profile;
  const sortedPhotos = photos.slice().sort((a, b) => b.postedAt - a.postedAt);

  return (
    <Flex justify="center">
      {photos.length > 0 ? (
        <Grid templateColumns="repeat(3, 1fr)" gap={2}>
          {sortedPhotos.map((photo) => (
            <Box key={photo.id}>
              <ProfilePhotoCard photo={photo} />
            </Box>
          ))}
        </Grid>
      ) : (
        <Text>No photos to display</Text>
      )}
    </Flex>
  );
}
