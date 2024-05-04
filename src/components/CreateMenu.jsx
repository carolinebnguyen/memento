import React from 'react';
import { Menu, MenuButton, MenuList, MenuItem, Button } from '@chakra-ui/react';
import { FiPlusCircle } from 'react-icons/fi';
import { AiFillPlusCircle } from 'react-icons/ai';

export default function CreateMenu() {
  return (
    <Menu>
      <MenuButton
        as={Button}
        leftIcon={<FiPlusCircle w="50px" />}
        textAlign="left"
        fontWeight={400}
        variant="whiteAlpha"
      >
        Create
      </MenuButton>
      <MenuList>
        <MenuItem as="a" href="/create">
          Create New Post
        </MenuItem>
        <MenuItem as="a" href="/create/drafts">
          View Drafts
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
