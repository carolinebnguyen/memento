import React, { useState } from 'react';
import { ConversationContext } from '../contexts/ConversationContext';

const ConversationProvider = ({ children }) => {
  const [selectedPartner, setSelectedPartner] = useState({});
  const [conversationList, setConversationList] = useState([]);

  return (
    <ConversationContext.Provider
      value={{
        selectedPartner,
        setSelectedPartner,
        conversationList,
        setConversationList,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};

export default ConversationProvider;
