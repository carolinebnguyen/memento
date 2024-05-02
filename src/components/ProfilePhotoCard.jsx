import React from 'react';
import { GridItem, Image } from '@chakra-ui/react';

export default function ProfilePhotoCard({ photo }) {
  const { imageSrc } = photo;

  return (
    <GridItem border="2px" borderColor="gray.200">
      <Image
        boxSize={{ base: '150px', sm: '250px', md: '500px' }}
        objectFit="cover"
        src={imageSrc}
      />
    </GridItem>
  );
}
