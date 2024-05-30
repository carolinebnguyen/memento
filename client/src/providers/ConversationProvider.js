import React, { useState } from 'react';
import { ConversationContext } from '../contexts/ConversationContext';

const ConversationProvider = ({ children }) => {
  const [conversationId, setConversationId] = useState('');

  return (
    <ConversationContext.Provider value={{ conversationId, setConversationId }}>
      {children}
    </ConversationContext.Provider>
  );
};

export default ConversationProvider;
