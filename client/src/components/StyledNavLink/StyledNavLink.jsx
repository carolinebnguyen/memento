import React from 'react';
import { Icon, Text, HStack } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import styles from './StyledNavLink.module.css';

export default function StyledNavLink({ to, icon, filledIcon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive ? styles['nav-link-active'] : styles['nav-link']
      }
    >
      {({ isActive }) => (
        <HStack p={2}>
          <Icon as={isActive ? filledIcon : icon} boxSize={22} />
          <Text fontWeight={isActive ? 'bold' : 'normal'}>{label}</Text>
        </HStack>
      )}
    </NavLink>
  );
}
