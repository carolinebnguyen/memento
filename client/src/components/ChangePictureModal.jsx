import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  HStack,
  Button,
  useToast,
  IconButton,
  Box,
  Image,
} from '@chakra-ui/react';
import { IoMdClose } from 'react-icons/io';
import DropZone from './Dropzone';
import { updateProfilePicture } from '../utils/userUtils';

export default function ChangePictureModal({ isOpen, onClose, setAvatarSrc }) {
  const [file, setFile] = useState(null);
  const toast = useToast();

  const removeFile = () => {
    if (file?.preview) {
      URL.revokeObjectURL(file.preview);
    }
    setFile(null);
  };

  const handleCancel = () => {
    removeFile();
  };

  const onSubmit = async () => {
    try {
      await updateProfilePicture(file);

      setTimeout(() => {
        setAvatarSrc(file.preview);
        removeFile();
        onClose();
        toast({
          title: 'Changes Saved',
          description: 'Your profile picture has been updated',
          status: 'success',
          variant: 'subtle',
          position: 'top',
          containerStyle: {
            zIndex: '9999',
          },
        });
      }, 1000);
    } catch (error) {
      console.error('Error uploading profile picture', error);
      toast({
        title: 'Error',
        description: 'Your profile picture could not be updated',
        status: 'error',
        variant: 'subtle',
        position: 'top',
        containerStyle: {
          zIndex: '9999',
        },
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">Change Profile Picture</ModalHeader>
        <ModalCloseButton />
        <ModalBody mb={3}>
          {!file ? (
            <DropZone setFile={setFile} />
          ) : (
            <Box>
              <Image src={file.preview} alt="Selected profile pic" />
              <IconButton
                onClick={removeFile}
                colorScheme="gray"
                icon={<IoMdClose />}
                size="sm"
                isRound={true}
                aria-label="Remove Picture"
                position="absolute"
                right="30px"
                top="80px"
                opacity="80%"
              />
              <HStack gap={3} mt={5} justify="center">
                <Button onClick={handleCancel}>Cancel</Button>
                <Button onClick={onSubmit} colorScheme="blue">
                  Change Picture
                </Button>
              </HStack>
            </Box>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
