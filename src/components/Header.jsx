import React from 'react';
import {
  Flex,
  Text,
  Avatar,
  Spacer,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Image,
  Icon,
  useBreakpointValue,
} from '@chakra-ui/react';
import { MdLogout, MdOutlineSettings } from 'react-icons/md';
import caroline from '../assets/carolineAvatar.png';
import { headerHeight } from '../utils/constants';

export default function Header() {
  const isWide = useBreakpointValue({ base: false, md: true });

  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      w={isWide ? `calc(100vw - 300px)` : `full`}
      px={5}
      borderBottomWidth="1px"
      borderColor="blackAlpha.300"
      h={headerHeight}
    >
      <Spacer />
      <Menu>
        <MenuButton as={Avatar} src={caroline} size="sm" cursor="pointer" />
        <MenuList>
          <MenuItem>
            <Image
              boxSize="3rem"
              borderRadius="full"
              src={caroline}
              alt="User profile picture"
              mr={2}
            />
            <Text>My Profile</Text>
          </MenuItem>
          <MenuDivider />
          <MenuItem>
            <Icon as={MdOutlineSettings} boxSize={5} mr={3} />
            Settings
          </MenuItem>
          <MenuItem>
            <Icon as={MdLogout} boxSize={5} mr={3} />
            Log Out
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
}
