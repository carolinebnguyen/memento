import React from 'react';
import UserProvider from '../providers/UserProvider';

const ContextWrapper = ({ children }) => (
  <UserProvider>{children}</UserProvider>
);

export default ContextWrapper;
