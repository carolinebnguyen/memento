import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Center,
  Box,
  Text,
} from '@chakra-ui/react';

export default function FollowModal({ isOpen, onClose, title, usersList }) {
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="lg"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody mb={3}>
            {usersList.length > 0 ? (
              <Box>
                {usersList.map((user, index) => (
                  <Text key={index}>{user.username}</Text>
                ))}
              </Box>
            ) : (
              <Center>No users to show</Center>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
