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
} from '@chakra-ui/react';
import UserCard from './UserCard';

export default function FollowModal({ isOpen, onClose, title, usersList }) {
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="md"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody mb={3}>
            {usersList.length > 0 ? (
              usersList.map((user, index) => (
                <Box key={user.username}>
                  <UserCard user={user} />
                </Box>
              ))
            ) : (
              <Center>No users to show</Center>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
