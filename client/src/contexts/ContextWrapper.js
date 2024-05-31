import React from 'react';
import UserProvider from '../providers/UserProvider';
import ConversationProvider from '../providers/ConversationProvider';

const ContextWrapper = ({ children }) => (
  <UserProvider>
    <ConversationProvider>{children}</ConversationProvider>
  </UserProvider>
);

export default ContextWrapper;
