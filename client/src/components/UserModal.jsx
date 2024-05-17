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
import { getUserInformation } from '../utils/userUtils';

export default function UserModal({ isOpen, onClose, title, usersList }) {
  const [users, setUsers] = useState(usersList);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const modifiedUsers = await Promise.all(
          usersList.map(async (user) => {
            if (typeof user === 'string') {
              return getUserInformation(user);
            }
            return user;
          })
        );
        setUsers(modifiedUsers);
      } catch (error) {
        return;
      }
    };
    fetchUserInfo();
  }, [usersList]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody mb={3}>
          {users && users.length > 0 ? (
            users.map((user, index) => (
              <Box
                key={user.username || user}
                mb={index !== users.length - 1 ? 3 : 0}
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
