import React, { useState } from 'react';
import {
  Flex,
  Input,
  Button,
  HStack,
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
import { usernameToProfileMap } from '../../utils/testData';

export default function Search() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    setSearched(true);
    const results = Object.keys(usernameToProfileMap).filter((username) =>
      username.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
  };

  const handleClearSearch = () => {
    setSearched(false);
    setQuery('');
  };

  const isSearchDisabled = query.trim() === '';

  return (
    <Flex align="center" justify="center" direction="column">
      <HStack>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Icon as={MdOutlineSearch} color="gray.300" boxSize={22} />
          </InputLeftElement>
          <Input
            type="text"
            placeholder="Search Memento"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query ? (
            <InputRightElement>
              <IconButton
                size="sm"
                icon={<IoMdClose />}
                variant="ghost"
                isRound={true}
                onClick={handleClearSearch}
              />
            </InputRightElement>
          ) : null}
        </InputGroup>
        <Button
          colorScheme="blue"
          onClick={handleSearch}
          isDisabled={isSearchDisabled}
        >
          Search
        </Button>
      </HStack>
      {searched && (
        <Flex direction="column" mt={4}>
          {searchResults.length > 0 ? (
            searchResults.map((username) => (
              <Box key={username}>{username}</Box>
            ))
          ) : (
            <Text>No results found</Text>
          )}
        </Flex>
      )}
    </Flex>
  );
}
