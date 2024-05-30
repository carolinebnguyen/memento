import React, { useContext } from 'react';
import { Icon, IconButton } from '@chakra-ui/react';
import { NavLink, useParams } from 'react-router-dom';
import styles from './CompactNavLink.module.css';
import { UserContext } from '../../contexts/UserContext';

function CompactNavLink({ to, icon, filledIcon }) {
  return (
    <NavLink to={to} className={styles['compact-nav-link']}>
      {({ isActive }) => (
        <Icon as={isActive ? filledIcon : icon} boxSize={22} />
      )}
    </NavLink>
  );
}

function CompactProfileNavLink({ to, icon, filledIcon }) {
  const { username } = useParams();
  const { currentUser } = useContext(UserContext);
  const { username: currentUsername } = currentUser;

  return (
    <NavLink to={to} className={styles['compact-nav-link']}>
      {({ isActive }) => (
        <Icon
          as={isActive && username === currentUsername ? filledIcon : icon}
          boxSize={22}
        />
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

export { CompactNavLink, CompactProfileNavLink, CompactIconButton };
