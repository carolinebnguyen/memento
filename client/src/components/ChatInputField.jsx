import { Flex, HStack, IconButton, Textarea, useToast } from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
import { BsFillSendFill } from 'react-icons/bs';
import {
  CHAT_INPUT_FIELD_HEIGHT,
  FULL_COMPACT_SIDEBAR_WIDTH,
  FULL_SIDEBAR_WIDTH,
} from '../utils/constants';
import { useLocation, useParams } from 'react-router-dom';
import { ConversationContext } from '../contexts/ConversationContext';
import { UserContext } from '../contexts/UserContext';
import { createConversation, sendMessage } from '../utils/messageUtils';

export default function ChatInputField({ onSendMessage }) {
  const [message, setMessage] = useState('');
  const [textareaHeight, setTextareaHeight] = useState('auto');
  const location = useLocation();
  const { conversationId } = useParams();
  const { selectedPartner, setSelectedPartner } =
    useContext(ConversationContext);
  const { currentUser } = useContext(UserContext);
  const toast = useToast();

  const resetField = () => {
    setMessage('');
    setTextareaHeight('auto');
  };

  useEffect(() => {
    resetField();
    const conversationContent = document.getElementById('conversation-content');
    conversationContent.style.marginBottom = CHAT_INPUT_FIELD_HEIGHT;
  }, [setMessage, location]);

  const handleMessageChange = (e) => {
    const textarea = e.target;
    const message = textarea.value;

    const scrollHeight = textarea.scrollHeight;

    const conversationContent = document.getElementById('conversation-content');
    let marginBottom = scrollHeight + 20;

    textarea.style.height = 'auto';
    textarea.style.height = `${scrollHeight}px`;

    setMessage(message);
    setTextareaHeight(`${scrollHeight}px`);

    if (message === '') {
      resetField();
      marginBottom = 60;
    }

    conversationContent.style.marginBottom = `${marginBottom}px`;
  };

  const handleSendMessage = async () => {
    const text = message.trim();

    if (text === '') {
      return;
    }

    try {
      const newMessage = {
        text: text,
        sender: currentUser.username,
        timestamp: Date.now(),
      };

      if (conversationId === 'new') {
        await createConversation(text, selectedPartner.username);
        setSelectedPartner(null);
      } else {
        await sendMessage(conversationId, text);
      }

      onSendMessage(newMessage);
      resetField();
      const conversationContent = document.getElementById(
        'conversation-content'
      );
      conversationContent.style.marginBottom = CHAT_INPUT_FIELD_HEIGHT;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error sending. Please try again later.',
        status: 'error',
        variant: 'subtle',
        position: 'top',
        containerStyle: {
          zIndex: '9999',
        },
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Flex
      position="fixed"
      bottom="0"
      ml={1}
      align="center"
      w={{
        base: `calc(100vw - ${FULL_COMPACT_SIDEBAR_WIDTH})`,
        md: `calc(100vw - ${FULL_SIDEBAR_WIDTH})`,
      }}
      mr={{ base: FULL_COMPACT_SIDEBAR_WIDTH, md: FULL_SIDEBAR_WIDTH }}
      p={3}
      bgColor="white"
    >
      <HStack w="99%">
        <Textarea
          rows={1}
          placeholder="Type a message"
          value={message}
          onChange={handleMessageChange}
          onKeyPress={handleKeyPress}
          borderRadius={10}
          minH="auto"
          maxH="30vh"
          resize="none"
          style={{
            overflow: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            height: textareaHeight,
          }}
        />
        <IconButton
          size="sm"
          icon={<BsFillSendFill />}
          colorScheme="blue"
          isRound={true}
          onClick={handleSendMessage}
        />
      </HStack>
    </Flex>
  );
}
