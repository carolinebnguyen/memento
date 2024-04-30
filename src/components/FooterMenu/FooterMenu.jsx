import React from 'react';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  MenuGroup,
} from '@chakra-ui/react';
import { MdMenu } from 'react-icons/md';
import styles from './FooterMenu.module.css';

export default function FooterMenu() {
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        icon={<MdMenu />}
        cursor="pointer"
        variant="link"
        mb={5}
      />
      <MenuList>
        <MenuGroup title="© 2024 Memento">
          <MenuItem
            as="a"
            href="/about"
            className={styles['compact-footer-link']}
          >
            About
          </MenuItem>
          <MenuItem
            as="a"
            href="/terms"
            className={styles['compact-footer-link']}
          >
            Terms
          </MenuItem>
          <MenuItem
            as="a"
            href="/privacy"
            className={styles['compact-footer-link']}
          >
            Privacy
          </MenuItem>
          <MenuItem
            as="a"
            href="/contact"
            className={styles['compact-footer-link']}
          >
            Contact
          </MenuItem>
        </MenuGroup>
      </MenuList>
    </Menu>
  );
}
