import React, { useState } from 'react';
import { ConversationContext } from '../contexts/ConversationContext';

const ConversationProvider = ({ children }) => {
  const [selectedPartner, setSelectedPartner] = useState({});
  const [conversationList, setConversationList] = useState([]);
  const [currentConversationCard, setCurrentConversationCard] = useState({});

  return (
    <ConversationContext.Provider
      value={{
        selectedPartner,
        setSelectedPartner,
        conversationList,
        setConversationList,
        currentConversationCard,
        setCurrentConversationCard,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};

export default ConversationProvider;
