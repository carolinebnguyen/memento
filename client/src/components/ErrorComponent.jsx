import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Text,
  Flex,
  Image,
  Heading,
  VStack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { getErrorContent } from '../utils/utils';

export default function ErrorComponent({ errorType }) {
  const navigate = useNavigate();
  const [errorContent, setErrorContent] = useState(() =>
    getErrorContent(errorType)
  );

  useEffect(() => {
    setErrorContent(getErrorContent(errorType));
  }, [errorType]);

  const { code, statusReason, errorMessage, imageSrc, altText, credits } =
    errorContent;

  const handleBackClick = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <Flex direction="column" h="100%">
      <Flex direction="column">
        <Box align="center" justify="center" p={5}>
          <Heading as="h1" size="4xl">
            {code}
          </Heading>
          <Text fontSize="5xl">{statusReason}</Text>
          <Text fontSize="xl">{errorMessage}</Text>
          {errorContent.back && (
            <Button m={5} colorScheme="blue" onClick={handleBackClick}>
              Go Back
            </Button>
          )}
        </Box>
        <VStack>
          <Image
            src={imageSrc}
            boxSize="500px"
            objectFit="cover"
            objectPosition="center"
            alt={altText}
          />
          {credits && <Text as="i">Source: {credits}</Text>}
        </VStack>
      </Flex>
    </Flex>
  );
}
