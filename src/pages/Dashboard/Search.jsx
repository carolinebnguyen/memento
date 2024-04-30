import React, { useState } from 'react';
import {
  Flex,
  Input,
  Button,
  HStack,
  InputGroup,
  InputLeftElement,
  Icon,
} from '@chakra-ui/react';
import { MdOutlineSearch } from 'react-icons/md';

export default function Search() {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    console.log(`Searched ${query}`);
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
        </InputGroup>
        <Button
          colorScheme="blue"
          onClick={handleSearch}
          isDisabled={isSearchDisabled}
        >
          Search
        </Button>
      </HStack>
    </Flex>
  );
}
