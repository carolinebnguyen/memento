import React from 'react';
import { Text, Grid, Box, Flex } from '@chakra-ui/react';
import ProfilePhotoCard from './ProfilePhotoCard';

export default function ProfilePhotoTabContent({ profile }) {
  const { photos } = profile;

  return (
    <Flex justify="center">
      {photos.length > 0 ? (
        <Grid templateColumns="repeat(3, 1fr)" gap={2}>
          {photos
            .slice()
            .reverse()
            .map((photo) => (
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
