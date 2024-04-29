import React from 'react';
import { Icon } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import styles from './CompactNavLink.module.css';

export default function CompactNavLink({ to, icon, filledIcon }) {
  return (
    <NavLink to={to} className={styles['compact-nav-link']}>
      {({ isActive }) => (
        <Icon as={isActive ? filledIcon : icon} boxSize={22} />
      )}
    </NavLink>
  );
}
