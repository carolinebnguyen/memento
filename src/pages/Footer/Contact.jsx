import React, { useState } from 'react';
import {
  Flex,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  InputGroup,
  InputRightElement,
  Box,
  Divider,
  AbsoluteCenter,
  Link,
} from '@chakra-ui/react';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function Contact() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () =>
    setIsPasswordVisible(!isPasswordVisible);

  return (
    <>
      <Navbar />
      <Flex justify="center" align="center" h="100vh">
        <Stack align="center" minW={{ base: '100%', lg: '50%', xl: '30%' }}>
          <Stack padding={9} paddingTop={0} align="center">
            <Heading as="h1">Contact Us</Heading>
            <Stack w="100%">
              <form>
                <FormControl>
                  <FormLabel fontSize="16px" fontWeight="500" mt={5}>
                    Email Address
                  </FormLabel>
                  <Input type="email" id="email" isRequired />
                  <FormLabel fontSize="16px" fontWeight="500" mt={5}>
                    Password
                  </FormLabel>
                  <InputGroup>
                    <Input
                      type={isPasswordVisible ? 'text' : 'password'}
                      id="password"
                      isRequired
                    />
                    <InputRightElement>
                      <Button
                        onClick={togglePasswordVisibility}
                        h="1.75rem"
                        size="xs"
                        colorScheme="whiteAlpha"
                      >
                        {isPasswordVisible ? (
                          <FaEye size={22} color="#232323" />
                        ) : (
                          <FaEyeSlash size={22} color="#232323" />
                        )}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <Button colorScheme="blue" type="submit" w="100%" mt={10}>
                    Log in
                  </Button>
                </FormControl>
              </form>
              <Box position="relative" mt={5}>
                <Divider />
                <AbsoluteCenter bg="white" px="4">
                  or
                </AbsoluteCenter>
              </Box>
              <Link href="/signup">
                <Button variant="outline" w="100%" mt={5}>
                  Sign up
                </Button>
              </Link>
            </Stack>
          </Stack>
        </Stack>
      </Flex>
      <Footer />
    </>
  );
}
