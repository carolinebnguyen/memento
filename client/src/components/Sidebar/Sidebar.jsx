import React, { useContext, useEffect, useState } from 'react';
import {
  useBreakpointValue,
  Flex,
  Text,
  Image,
  HStack,
  Stack,
  Divider,
  Icon,
  Spinner,
  Center,
  useToast,
} from '@chakra-ui/react';
import {
  MdOutlineHome,
  MdHome,
  MdOutlineSearch,
  MdLogout,
  MdOutlineSettings,
  MdSettings,
} from 'react-icons/md';
import { FaRegBell, FaBell, FaRegUser, FaUser, FaSearch } from 'react-icons/fa';
import { FiPlusCircle } from 'react-icons/fi';
import { AiFillPlusCircle } from 'react-icons/ai';
import { MdMailOutline, MdMail } from 'react-icons/md';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import logo from '../../assets/logoBlack.png';
import StyledNavLink from '../StyledNavLink/StyledNavLink';
import BottomNav from '../BottomNav/BottomNav';
import styles from './Sidebar.module.css';
import linkStyles from '../StyledNavLink/StyledNavLink.module.css';
import { SIDEBAR_WIDTH } from '../../utils/constants';
import Header from '../Header/Header';
import CompactSidebar from '../CompactSidebar';
import {
  isUserLoggedIn,
  logOutUser,
  setUserLoggedOut,
} from '../../utils/authUtils';
import { UserContext } from '../../contexts/UserContext';

export default function Sidebar() {
  const isCollapsed = useBreakpointValue({ base: true, sm: false });
  const isCompact = useBreakpointValue({ sm: true, md: false });
  const navigate = useNavigate();

  useEffect(() => {
    if (!isUserLoggedIn()) {
      navigate('/');
    }
  });

  return (
    <Flex minH="100vh" h="100%" position="fixed" zIndex="2">
      {isCollapsed ? (
        <>
          <Header />
          <BottomNav />
        </>
      ) : isCompact ? (
        <CompactSidebar />
      ) : (
        <FullSidebar />
      )}
    </Flex>
  );
}

function FullSidebar() {
  return (
    <Flex
      direction="column"
      boxShadow="md"
      p={3}
      w={SIDEBAR_WIDTH}
      zIndex="9999"
    >
      <NavLink to="/home">
        <Image src={logo} alt="Memento logo" p={3} />
      </NavLink>
      <SidebarContent />
    </Flex>
  );
}

function SidebarContent() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useContext(UserContext);
  const { username: currentUsername } = currentUser;
  const toast = useToast();

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logOutUser();
      setTimeout(() => {
        setUserLoggedOut();
        navigate('/');
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      toast({
        title: 'Error',
        description: 'Error logging out. Please try again later.',
        status: 'error',
        variant: 'subtle',
        position: 'top',
        containerStyle: {
          zIndex: '9999',
        },
      });
    }
  };

  return (
    <Flex direction="column" justify="space-between" h="100%">
      <Stack gap={5} mt={5}>
        <StyledNavLink
          to="/home"
          icon={MdOutlineHome}
          filledIcon={MdHome}
          label="Home"
        />
        <StyledNavLink
          to="/search"
          icon={MdOutlineSearch}
          filledIcon={FaSearch}
          label="Search"
        />
        <StyledNavLink
          to="/create"
          icon={FiPlusCircle}
          filledIcon={AiFillPlusCircle}
          label="Create"
        />
        <StyledNavLink
          to="/messages"
          icon={MdMailOutline}
          filledIcon={MdMail}
          label="Messages"
        />
        <StyledNavLink
          to="/notifications"
          icon={FaRegBell}
          filledIcon={FaBell}
          label="Notifications"
        />
        <NavLink
          to={`/profile/${currentUsername}`}
          className={({ isActive }) =>
            isActive && username === currentUsername
              ? linkStyles['nav-link-active']
              : linkStyles['nav-link']
          }
        >
          {({ isActive }) => (
            <HStack p={2}>
              <Icon
                as={
                  isActive && username === currentUsername ? FaUser : FaRegUser
                }
                boxSize={22}
              />
              <Text
                fontWeight={
                  isActive && username === currentUsername ? 'bold' : 'normal'
                }
              >
                Profile
              </Text>
            </HStack>
          )}
        </NavLink>
        <Divider />
        <StyledNavLink
          to="/settings"
          icon={MdOutlineSettings}
          filledIcon={MdSettings}
          label="Settings"
        />
        <Flex
          className={linkStyles['nav-link']}
          _hover={{ cursor: 'pointer' }}
          onClick={handleLogout}
        >
          <HStack p={2}>
            <Icon as={MdLogout} boxSize={22} />
            <Text fontWeight="normal">Log Out</Text>
          </HStack>
        </Flex>
      </Stack>
      {isLoading && (
        <Center>
          <Spinner />
        </Center>
      )}
      <Stack fontSize={12} p={3}>
        <Text>© 2024 Memento</Text>
        <HStack justify="space-between">
          <FooterNavLink to="/about" label="About" />
          <FooterNavLink to="/terms" label="Terms" />
          <FooterNavLink to="/privacy" label="Privacy" />
          <FooterNavLink to="/contact" label="Contact" />
        </HStack>
      </Stack>
    </Flex>
  );
}

function FooterNavLink({ to, label }) {
  return (
    <NavLink to={to} className={styles['footer-link']}>
      {label}
    </NavLink>
  );
}
