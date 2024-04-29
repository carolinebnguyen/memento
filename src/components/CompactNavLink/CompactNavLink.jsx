import React from 'react';
import { Icon, IconButton } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import styles from './CompactNavLink.module.css';

function CompactNavLink({ to, icon, filledIcon }) {
  return (
    <NavLink to={to} className={styles['compact-nav-link']}>
      {({ isActive }) => (
        <Icon as={isActive ? filledIcon : icon} boxSize={22} />
      )}
    </NavLink>
  );
}

function CompactIconButton({ to, icon, filledIcon }) {
  return (
    <NavLink to={to} className={styles['compact-nav-link']}>
      {({ isActive }) => (
        <IconButton
          icon={React.createElement(isActive ? filledIcon : icon)}
          variant="ghost"
          size="md"
        />
      )}
    </NavLink>
  );
}
export { CompactNavLink, CompactIconButton };
