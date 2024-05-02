import React, { useState } from 'react';
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
} from '@chakra-ui/react';
import { MdOutlineSearch } from 'react-icons/md';
import { IoMdClose } from 'react-icons/io';
import { usernameToProfileMap, getProfile } from '../../utils/testData';
import UserCard from '../../components/UserCard';

export default function Search() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    if (query.trim() !== '') {
      setSearched(true);
      const results = Object.keys(usernameToProfileMap).filter((username) =>
        username.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    }
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
        <Flex direction="column" mt={4} w="full">
          {searchResults.length > 0 ? (
            searchResults.map((username) => (
              <Box key={username} mb={4}>
                <UserCard user={getProfile(username)} />
              </Box>
            ))
          ) : (
            <Text>No results found</Text>
          )}
        </Flex>
      )}
    </Flex>
  );
}
