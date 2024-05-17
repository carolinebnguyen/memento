import React from 'react';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { FaEllipsis } from 'react-icons/fa6';
import styles from '../components/BottomNav/BottomNav.module.css';

export default function CommentMenu({
  isCommentSelfPosted,
  toggleEditMode,
  onOpen,
}) {
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={<FaEllipsis />}
        variant="ghost"
        color="gray"
        size="xs"
      />
      <MenuList>
        {isCommentSelfPosted && (
          <MenuItem
            icon={<EditIcon />}
            className={styles['menu-link']}
            onClick={toggleEditMode}
            fontSize="sm"
          >
            Edit Comment
          </MenuItem>
        )}
        <MenuItem
          icon={<DeleteIcon />}
          onClick={onOpen}
          className={styles['menu-link']}
          fontSize="sm"
        >
          Delete Comment
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
