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
  Image,
  Box,
  Divider,
  AbsoluteCenter,
  Link,
  HStack,
} from '@chakra-ui/react';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import logo from '../../assets/logoBlack.png';
import Footer from '../../components/Footer';

export default function Signup() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () =>
    setIsPasswordVisible(!isPasswordVisible);

  return (
    <>
      <Flex justify="center" align="center" h="100vh">
        <Stack align="center" minW={{ base: '100%', lg: '50%', xl: '30%' }}>
          <Link href="/">
            <Image src={logo} alt="Memento logo" mb={5} />
          </Link>
          <Stack padding={9} paddingTop={0} align="center">
            <Heading as="h1">Sign Up</Heading>
            <Stack w="100%">
              <form>
                <FormControl isRequired>
                  <FormLabel fontSize="16px" fontWeight="500" mt={5}>
                    Email Address
                  </FormLabel>
                  <Input type="email" id="email" isRequired />
                  <HStack>
                    <Stack>
                      <FormLabel fontSize="16px" fontWeight="500" mt={5}>
                        First Name
                      </FormLabel>
                      <Input type="text" id="firstName" isRequired />
                    </Stack>
                    <Stack>
                      <FormLabel fontSize="16px" fontWeight="500" mt={5}>
                        Last Name
                      </FormLabel>
                      <Input type="text" id="lastName" isRequired />
                    </Stack>
                  </HStack>
                  <FormLabel fontSize="16px" fontWeight="500" mt={5}>
                    Username
                  </FormLabel>
                  <Input type="text" id="username" isRequired />
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
                    Sign up
                  </Button>
                </FormControl>
              </form>
              <Box position="relative" mt={5}>
                <Divider />
                <AbsoluteCenter bg="white" px="4">
                  or
                </AbsoluteCenter>
              </Box>
              <Link href="/">
                <Button variant="outline" w="100%" mt={5}>
                  Log in
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
