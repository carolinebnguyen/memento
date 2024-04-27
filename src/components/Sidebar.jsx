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
      <Flex direction="column" boxShadow="md" p={3}>
        <Link href="/">
          <Image src={logo} alt="Memento logo" p={3} />
        </Link>
        <SidebarContent />
      </Flex>
    </>
  );
}

function SidebarContent() {
  return (
    <>
      <Stack gap={3} mt={5}>
        <Link
          _hover={{
            bg: 'blue.50',
          }}
          href="/home"
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
        >
          <HStack p={2}>
            <Icon as={FiPlusCircle} boxSize={22} />
            <Text>Create</Text>
          </HStack>
        </Link>
      </Stack>
    </>
  );
}
