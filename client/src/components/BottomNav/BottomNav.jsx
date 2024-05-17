import React, { useState, useEffect } from 'react';
import {
  Flex,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Image,
  Icon,
  useBreakpointValue,
  IconButton,
} from '@chakra-ui/react';
import {
  MdOutlineHome,
  MdHome,
  MdOutlineSearch,
  MdLogout,
  MdOutlineSettings,
} from 'react-icons/md';
import { FaRegUser, FaUser, FaSearch, FaRegBell, FaBell } from 'react-icons/fa';
import { FiPlusCircle } from 'react-icons/fi';
import { AiFillPlusCircle } from 'react-icons/ai';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { CompactIconButton } from '../CompactNavLink/CompactNavLink';
import { headerHeight, sidebarWidth } from '../../utils/constants';
import styles from './BottomNav.module.css';
import { logOutUser, setUserLoggedOut } from '../../utils/authUtils';
import { getCurrentUserProfile } from '../../utils/userUtils';

export default function BottomNav() {
  const isWide = useBreakpointValue({ base: false, md: true });
  const navigate = useNavigate();
  const { username } = useParams();
  const [currentUser, setCurrentUser] = useState({});
  const { username: currentUsername, picture } = currentUser;

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
      setTimeout(() => {
        setUserLoggedOut();
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error('Error logging out ', error);
    }
  };

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      w={isWide ? `calc(100vw - ${sidebarWidth})` : `full`}
      px={5}
      borderTopWidth="1px"
      borderColor="blackAlpha.300"
      h={headerHeight}
      position="fixed"
      bottom="0"
      bgColor="white"
    >
      <CompactIconButton to="/home" icon={MdOutlineHome} filledIcon={MdHome} />
      <CompactIconButton
        to="/search"
        icon={MdOutlineSearch}
        filledIcon={FaSearch}
      />
      <CompactIconButton
        to="/create"
        icon={FiPlusCircle}
        filledIcon={AiFillPlusCircle}
      />
      <CompactIconButton
        to="/notifications"
        icon={FaRegBell}
        filledIcon={FaBell}
      />
      <Menu>
        <MenuButton
          as={IconButton}
          icon={username === currentUsername ? <FaUser /> : <FaRegUser />}
          cursor="pointer"
          variant="ghost"
        />
        <MenuList>
          <MenuItem
            as={NavLink}
            to={`/profile/${currentUsername}`}
            className={styles['menu-link']}
          >
            <Image
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
          <MenuItem as={NavLink} to="/settings" className={styles['menu-link']}>
            <Icon as={MdOutlineSettings} boxSize={5} mr={3} />
            Settings
          </MenuItem>
          <MenuItem className={styles['menu-link']} onClick={handleLogout}>
            <Icon as={MdLogout} boxSize={5} mr={3} />
            Log Out
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
}
