import React from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  useBreakpointValue,
  Flex,
  Icon,
  Text,
  Image,
  HStack,
  Stack,
} from '@chakra-ui/react';
import {
  MdOutlineHome,
  MdOutlineSearch,
  MdMenu,
  MdOutlineMail,
} from 'react-icons/md';
import { FaRegBell } from 'react-icons/fa';
import { FiPlusCircle } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';
import logo from '../../assets/logoBlack.png';
import styles from './Sidebar.module.css';
import { headerHeight, sidebarWidth } from '../../utils/constants';

export default function Sidebar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isCollapsed = useBreakpointValue({ base: true, md: false });

  return (
    <Flex minH="100vh" h="100%" position="fixed" zIndex="2">
      {isCollapsed ? (
        <>
          <Icon
            as={MdMenu}
            boxSize={30}
            pl={2}
            onClick={onOpen}
            cursor="pointer"
            h={headerHeight}
          >
            Open Modal
          </Icon>
          <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader borderBottomWidth="1px">
                <NavLink to="/">
                  <Image src={logo} alt="Memento logo" />
                </NavLink>
              </DrawerHeader>
              <DrawerBody>
                <SidebarContent />
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </>
      ) : (
        <FullSidebar />
      )}
    </Flex>
  );
}

function FullSidebar() {
  return (
    <>
      <Flex
        direction="column"
        boxShadow="md"
        p={3}
        w={sidebarWidth}
        zIndex="9999"
      >
        <NavLink to="/">
          <Image src={logo} alt="Memento logo" p={3} />
        </NavLink>
        <SidebarContent />
      </Flex>
    </>
  );
}

function SidebarContent() {
  return (
    <>
      <Flex direction="column" justify="space-between" h="100%">
        <Stack gap={5} mt={5}>
          <CustomNavLink to="/home" icon={MdOutlineHome} label="Home" />
          <CustomNavLink to="/search" icon={MdOutlineSearch} label="Search" />
          <CustomNavLink
            to="/messages"
            icon={MdOutlineMail}
            label="Direct Messages"
          />
          <CustomNavLink
            to="/notifications"
            icon={FaRegBell}
            label="Notifications"
          />
          <CustomNavLink to="/create" icon={FiPlusCircle} label="Create" />
        </Stack>
        <Stack fontSize={12} mb={5}>
          <Text>© 2024 Memento</Text>
          <HStack justify="space-between">
            <NavLink to="/about">About</NavLink>
            <NavLink to="/terms">Terms</NavLink>
            <NavLink to="/privacy">Privacy</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </HStack>
        </Stack>
      </Flex>
    </>
  );
}

function CustomNavLink({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive ? styles['nav-link-active'] : styles['nav-link']
      }
    >
      <HStack p={2}>
        <Icon as={icon} boxSize={22} />
        <Text>{label}</Text>
      </HStack>
    </NavLink>
  );
}
