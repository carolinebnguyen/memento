import React, { useEffect, useState } from 'react';
import Fuse from 'fuse.js';
import {
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  Box,
  Text,
  InputRightElement,
  IconButton,
  Center,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { MdOutlineSearch } from 'react-icons/md';
import { IoMdClose } from 'react-icons/io';
import UserCard from '../../components/UserCard';
import { getAllUsers } from '../../utils/userUtils';

export default function Search() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [users, setUsers] = useState([]);

  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const resetAlert = () => {
    setAlertMessage('');
    setIsAlertVisible(false);
  };

  const fuse = new Fuse(users, { keys: ['name', 'username'] });

  useEffect(() => {
    resetAlert();
    const fetchAllUsers = async () => {
      try {
        const users = await getAllUsers();
        setUsers(users);
      } catch (error) {
        const errorMessage =
          error.response?.data?.error ?? 'An unexpected error occurred';
        setAlertMessage(errorMessage);
        setIsAlertVisible(true);
      }
    };
    fetchAllUsers();
  }, []);

  const handleSearch = () => {
    setSearched(true);

    if (isAlertVisible) {
      return;
    }

    if (query.trim() === '' && !isAlertVisible) {
      setSearchResults(users);
    } else {
      const results = fuse.search(query);
      setSearchResults(results.map((result) => result.item));
    }

    resetAlert();
  };

  const handleClearSearch = () => {
    setQuery('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Flex align="center" justify="center" direction="column">
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <Icon as={MdOutlineSearch} color="gray.300" boxSize={22} />
        </InputLeftElement>
        <Input
          type="text"
          placeholder="Search Memento"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <InputRightElement>
          {query ? (
            <IconButton
              size="sm"
              icon={<IoMdClose />}
              variant="ghost"
              isRound={true}
              onClick={handleClearSearch}
            />
          ) : null}
        </InputRightElement>
      </InputGroup>
      {searched && (
        <Flex direction="column" mt={isAlertVisible ? 4 : 8} w="full">
          {searchResults.length > 0 ? (
            searchResults.map((user, index) => (
              <Box key={user.username} mb={4}>
                <UserCard user={user} />
              </Box>
            ))
          ) : (
            <Center>
              {isAlertVisible ? (
                <Alert status="error">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{alertMessage}</AlertDescription>
                  </Box>
                </Alert>
              ) : (
                <Text>No results found</Text>
              )}
            </Center>
          )}
        </Flex>
      )}
    </Flex>
  );
}
