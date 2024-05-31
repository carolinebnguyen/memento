import { Flex, HStack, IconButton, Textarea } from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
import { BsFillSendFill } from 'react-icons/bs';
import {
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

  const resetField = () => {
    setMessage('');
    setTextareaHeight('auto');
  };

  useEffect(() => {
    resetField();
  }, [setMessage, location]);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    setTextareaHeight(`${e.target.scrollHeight}px`);
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
    } catch (error) {
      console.error('error sending message: ', error);
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
