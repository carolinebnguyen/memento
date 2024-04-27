import React, { useState } from 'react';
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
  Link,
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
import { useLocation } from 'react-router-dom';
import logo from '../assets/logoBlack.png';

export default function Sidebar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isCollapsed = useBreakpointValue({ base: true, md: false });

  return (
    <Flex h="100vh">
      {isCollapsed ? (
        <>
          {' '}
          <Icon
            as={MdMenu}
            boxSize={22}
            m={4}
            onClick={onOpen}
            cursor="pointer"
          >
            Open Modal
          </Icon>
          <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader borderBottomWidth="1px">
                <Link href="/">
                  <Image src={logo} alt="Memento logo" />
                </Link>
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
      <Flex direction="column" boxShadow="md" p={3} w="300px">
        <Link href="/">
          <Image src={logo} alt="Memento logo" p={3} />
        </Link>
        <SidebarContent />
      </Flex>
    </>
  );
}

function SidebarContent() {
  const location = useLocation();
  const { pathname } = location;
  const [activeLink, setActiveLink] = useState(pathname);

  const handleLinkClick = (pathname) => {
    setActiveLink(pathname);
  };

  return (
    <>
      <Flex direction="column" justify="space-between" h="100%">
        <Stack gap={3} mt={5}>
          <Link
            _hover={{
              bg: 'blue.50',
            }}
            href="/home"
            onClick={() => handleLinkClick('/home')}
            bgColor={activeLink === '/home' ? 'blue.50' : undefined}
          >
            <HStack p={2}>
              <Icon as={MdOutlineHome} boxSize={22} />
              <Text>Home</Text>
            </HStack>
          </Link>
          <Link
            _hover={{
              bg: 'blue.50',
            }}
            href="/search"
            onClick={() => handleLinkClick('/search')}
            bgColor={activeLink === '/search' ? 'blue.50' : undefined}
          >
            <HStack p={2}>
              <Icon as={MdOutlineSearch} boxSize={22} />
              <Text>Search</Text>
            </HStack>
          </Link>
          <Link
            _hover={{
              bg: 'blue.50',
            }}
            href="/messages"
            onClick={() => handleLinkClick('/messages')}
            bgColor={activeLink === '/messages' ? 'blue.50' : undefined}
          >
            <HStack p={2}>
              <Icon as={MdOutlineMail} boxSize={22} />
              <Text>Direct Messages</Text>
            </HStack>
          </Link>
          <Link
            _hover={{
              bg: 'blue.50',
            }}
            href="/notifications"
            onClick={() => handleLinkClick('/notifications')}
            bgColor={activeLink === '/notifications' ? 'blue.50' : undefined}
          >
            <HStack p={2}>
              <Icon as={FaRegBell} boxSize={22} />
              <Text>Notifications</Text>
            </HStack>
          </Link>
          <Link
            _hover={{
              bg: 'blue.50',
            }}
            href="/create"
            onClick={() => handleLinkClick('/create')}
            bgColor={activeLink === '/create' ? 'blue.50' : undefined}
          >
            <HStack p={2}>
              <Icon as={FiPlusCircle} boxSize={22} />
              <Text>Create</Text>
            </HStack>
          </Link>
        </Stack>
        <Stack fontSize={12}>
          <Text>© 2024 Memento</Text>
          <HStack justify="space-between">
            <Link href="/about">About</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/contact">Contact</Link>
          </HStack>
        </Stack>
      </Flex>
    </>
  );
}
