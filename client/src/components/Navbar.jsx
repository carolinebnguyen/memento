import React from 'react';
import {
  Flex,
  Image,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Icon,
  Avatar,
  Text,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { MdLogout, MdOutlineSettings } from 'react-icons/md';
import logo from '../assets/logoBlack.png';
import { isUserLoggedIn, setUserLoggedOut } from '../utils/authUtils';
import caroline from '../assets/placeholders/carolineAvatarClear.png';
import styles from '../components/BottomNav/BottomNav.module.css';

export default function Navbar() {
  const isLoggedIn = isUserLoggedIn();

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      padding="1rem"
      position="fixed"
      top="0"
      zIndex="9999"
      w="100%"
      bgColor="whiteAlpha.900"
    >
      <Link to="/">
        <Image src={logo} alt="Memento logo" />
      </Link>
      {isLoggedIn ? (
        <Menu>
          <MenuButton
            as={Avatar}
            src={caroline}
            cursor="pointer"
            variant="ghost"
          />
          <MenuList>
            <MenuItem
              as="a"
              href="/profile?username=carolibn"
              className={styles['menu-link']}
            >
              <Image
                boxSize="3rem"
                borderRadius="full"
                src={caroline}
                alt="User profile picture"
                mr={2}
                size="lg"
              />
              <Text>My Profile</Text>
            </MenuItem>
            <MenuDivider />
            <MenuItem as="a" href="/settings" className={styles['menu-link']}>
              <Icon as={MdOutlineSettings} boxSize={5} mr={3} />
              Settings
            </MenuItem>
            <MenuItem
              as="a"
              href="/"
              className={styles['menu-link']}
              onClick={() => {
                setUserLoggedOut();
              }}
            >
              <Icon as={MdLogout} boxSize={5} mr={3} />
              Log Out
            </MenuItem>
          </MenuList>
        </Menu>
      ) : (
        <Flex gap={{ base: 2, sm: 5 }}>
          <Link to="/">
            <Button variant="outline" ml={{ base: 2, sm: 0 }}>
              Sign In
            </Button>
          </Link>
          <Link to="/signup">
            <Button colorScheme="blue">Sign Up</Button>
          </Link>
        </Flex>
      )}
    </Flex>
  );
}
