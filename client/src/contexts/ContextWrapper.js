import React from 'react';
import ConversationProvider from '../providers/ConversationProvider';

const ContextWrapper = ({ children }) => (
  <ConversationProvider>{children}</ConversationProvider>
);

export default ContextWrapper;
