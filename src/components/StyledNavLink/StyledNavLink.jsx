import React from 'react';
import { Icon, Text, HStack } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import styles from './StyledNavLink.module.css';

export default function StyledNavLink({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive ? styles['nav-link-active'] : styles['nav-link']
      }
    >
      <HStack p={2}>
        <Icon as={icon} boxSize={22} />
        <Text>{label}</Text>
      </HStack>
    </NavLink>
  );
}
