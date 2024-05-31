import React, { useState, useEffect, useContext } from 'react';
import Fuse from 'fuse.js';
import { getAllUsers } from '../utils/userUtils';
import {
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Box,
  useToast,
  Center,
  Text,
  Card,
  Badge,
  IconButton,
} from '@chakra-ui/react';
import UserSearchResultCard from './UserSearchResultCard';
import { IoMdClose } from 'react-icons/io';
import { UserContext } from '../contexts/UserContext';

export default function UserSearchBar({ setSelectedUsername }) {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState();
  const { currentUser } = useContext(UserContext);
  const { username: currentUsername } = currentUser;
  const toast = useToast();

  useEffect(() => {
    const fetchUsernames = async () => {
      try {
        const users = await getAllUsers();
        setUsers(users.filter((user) => user.username !== currentUsername));
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Error fetching users',
          status: 'error',
          variant: 'subtle',
          position: 'top',
          containerStyle: {
            zIndex: '9999',
          },
        });
      }
    };

    fetchUsernames();
  }, [toast, currentUsername]);

  useEffect(() => {
    if (query) {
      const fuse = new Fuse(users, { keys: ['name', 'username'] });
      const results = fuse.search(query);
      setSearchResults(results.map((result) => result.item));
    } else {
      setSearchResults([]);
    }
  }, [query, users]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setSelectedUsername(user.username);
    setQuery('');
  };

  const handleUserRemoval = () => {
    setSelectedUser(null);
    setSelectedUsername('');
  };

  return (
    <Flex align="center" justify="center" direction="column">
      <InputGroup position="relative">
        <InputLeftElement pointerEvents="none">
          <Text color="gray.500" fontSize="14px" fontWeight={700}>
            To:
          </Text>
        </InputLeftElement>
        <Input
          type="text"
          placeholder={!selectedUser && 'Search...'}
          fontSize="14px"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          isReadOnly={selectedUser}
          cursor={selectedUser ? 'default' : 'text'}
        />
        {selectedUser && (
          <Badge
            borderRadius={20}
            key={selectedUser.username}
            colorScheme="blue"
            variant="solid"
            position="absolute"
            left="40px"
            top="50%"
            pl={2}
            zIndex="100"
            transform="translateY(-50%)"
            style={{ textTransform: 'lowercase' }}
          >
            {selectedUser.username}
            <IconButton
              icon={<IoMdClose />}
              size="xs"
              variant="ghost"
              colorScheme="white"
              isRound={true}
              onClick={() => handleUserRemoval()}
            />
          </Badge>
        )}
      </InputGroup>
      <Flex direction="column" w="full">
        {query.length > 0 && query.trim() !== '' ? (
          searchResults.length > 0 ? (
            <Card borderRadius={10}>
              {searchResults.map((user) => (
                <Box key={user.username} onClick={() => handleUserClick(user)}>
                  <UserSearchResultCard user={user} />
                </Box>
              ))}
            </Card>
          ) : (
            <Center mt={4}>
              <Text>No results found</Text>
            </Center>
          )
        ) : null}
      </Flex>
    </Flex>
  );
}
