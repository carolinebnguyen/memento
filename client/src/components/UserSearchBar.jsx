import React, { useState, useEffect } from 'react';
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
} from '@chakra-ui/react';
import UserSearchResultCard from './UserSearchResultCard';

export default function UserSearchBar() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [users, setUsers] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const fetchUsernames = async () => {
      try {
        const users = await getAllUsers();
        setUsers(users);
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
  }, [toast]);

  useEffect(() => {
    if (query) {
      const fuse = new Fuse(users, { keys: ['name', 'username'] });
      const results = fuse.search(query);
      setSearchResults(results.map((result) => result.item));
    } else {
      setSearchResults([]);
    }
  }, [query, users]);

  return (
    <Flex align="center" justify="center" direction="column">
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <Text color="gray.300">To</Text>
        </InputLeftElement>
        <Input
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </InputGroup>
      <Flex direction="column" mt={4} w="full">
        {query.length > 0 && query.trim() !== '' ? (
          searchResults.length > 0 ? (
            searchResults.map((user) => (
              <Box key={user.username} mb={2}>
                <UserSearchResultCard user={user} />
              </Box>
            ))
          ) : (
            <Center>
              <Text>No results found</Text>
            </Center>
          )
        ) : null}
      </Flex>
    </Flex>
  );
}
