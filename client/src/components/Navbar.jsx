import React, { useEffect, useState } from 'react';
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
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { MdLogout, MdOutlineSettings } from 'react-icons/md';
import logo from '../assets/logoBlack.png';
import {
  isUserLoggedIn,
  logOutUser,
  setUserLoggedOut,
} from '../utils/authUtils';
import styles from '../components/BottomNav/BottomNav.module.css';
import { getCurrentUserProfile } from '../utils/userUtils';

export default function Navbar() {
  const isLoggedIn = isUserLoggedIn();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({});
  const { username, picture } = currentUser;

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const { user } = await getCurrentUserProfile();
        setCurrentUser(user);
      } catch (error) {
        return;
      }
    };
    fetchCurrentUser();
  }, []);

  const handleLogout = async () => {
    try {
      await logOutUser();
      setUserLoggedOut();
      navigate('/');
    } catch (error) {
      console.error('Error logging out ', error);
    }
  };

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
            src={picture}
            cursor="pointer"
            variant="ghost"
          />
          <MenuList>
            <MenuItem
              as={NavLink}
              to={`/profile/${username}`}
              className={styles['menu-link']}
            >
              <Image
                as={Avatar}
                boxSize="3rem"
                borderRadius="full"
                objectFit="cover"
                src={picture}
                mr={4}
                size="lg"
              />
              <Text>My Profile</Text>
            </MenuItem>
            <MenuDivider />
            <MenuItem
              as={NavLink}
              to="/settings"
              className={styles['menu-link']}
            >
              <Icon as={MdOutlineSettings} boxSize={5} mr={3} />
              Settings
            </MenuItem>
            <MenuItem
              as="a"
              href="/"
              className={styles['menu-link']}
              onClick={handleLogout}
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
