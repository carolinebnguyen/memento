import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  useToast,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import UserSearchBar from './UserSearchBar';
import { COMPACT_SIDEBAR_WIDTH } from '../utils/constants';
import { getConversationIdByUsername } from '../utils/messageUtils';
import { useNavigate } from 'react-router-dom';

export default function CreateConversationModal({ isOpen, onClose }) {
  const [selectedUsername, setSelectedUsername] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  const handleChat = async () => {
    try {
      const conversationId = await getConversationIdByUsername(
        selectedUsername
      );
      setTimeout(() => {
        onClose();
        navigate(`/messages/${conversationId}`);
      }, 500);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error handling chat. Please try again later.',
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      scrollBehavior="inside"
      isCentered
    >
      <ModalOverlay />
      <ModalContent
        h="50vh"
        w={{ base: `calc(100vw - ${COMPACT_SIDEBAR_WIDTH} * 2)`, sm: '100vw' }}
      >
        <ModalHeader textAlign="center">New Message</ModalHeader>
        <ModalCloseButton />
        <ModalBody mb={3}>
          <UserSearchBar setSelectedUsername={setSelectedUsername} />
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            w="100%"
            isDisabled={!selectedUsername}
            onClick={() => handleChat()}
          >
            Chat
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
