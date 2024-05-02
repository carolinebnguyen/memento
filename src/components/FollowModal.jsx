import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';

export default function FollowModal({ isOpen, onClose, title }) {
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
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore ab
            in totam est exercitationem? Tenetur laborum voluptas similique
            possimus quos dolore ducimus hic eveniet autem accusantium. Dolorum
            soluta est expedita!
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
