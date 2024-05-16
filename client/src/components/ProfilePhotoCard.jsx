import React from 'react';
import { GridItem, Image } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export default function ProfilePhotoCard({ photo }) {
  const { postId, imageSrc } = photo;
  const navigate = useNavigate();

  const handlePostNavigate = () => {
    navigate(`/post/${postId}`);
  };

  return (
    <GridItem border="2px" borderColor="gray.200">
      <Image
        boxSize={{ base: '450px', sm: '250px', md: '500px' }}
        objectFit="cover"
        src={imageSrc}
        _hover={{ cursor: 'pointer' }}
        onClick={handlePostNavigate}
      />
    </GridItem>
  );
}
