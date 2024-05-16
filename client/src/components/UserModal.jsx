import React, { useEffect, useState } from 'react';
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
import { getAllUserProfiles } from '../utils/userUtils';

export default function UserModal({ isOpen, onClose, title, usersList }) {
  const [userProfiles, setUserProfiles] = useState([]);

  useEffect(() => {
    const fetchUserProfiles = async () => {
      try {
        const profiles = await getAllUserProfiles(usersList);
        setUserProfiles(profiles);
      } catch (error) {
        return;
      }
    };
    fetchUserProfiles();
  }, [usersList]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody mb={3}>
          {userProfiles && userProfiles.length > 0 ? (
            userProfiles.map((user, index) => (
              <Box
                key={user.username}
                mb={index !== userProfiles.length - 1 ? 3 : 0}
              >
                <UserCard user={user} handleClose={onClose} />
              </Box>
            ))
          ) : (
            <Center>No users to show</Center>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
