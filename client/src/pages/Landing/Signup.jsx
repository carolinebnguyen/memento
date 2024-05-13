import React, { useEffect, useState } from 'react';
import {
  Flex,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Image,
  Box,
  Divider,
  AbsoluteCenter,
  Text,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  FormHelperText,
} from '@chakra-ui/react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../assets/logoBlack.png';
import PasswordField from '../../components/PasswordField';
import { passwordRegex, passwordErrorMessage } from '../../utils/utils';
import {
  signUpUser,
  setUserLoggedIn,
  isUserLoggedIn,
} from '../../utils/authUtils';

export default function Signup() {
  const navigate = useNavigate();
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const toast = useToast();

  useEffect(() => {
    if (isUserLoggedIn()) {
      navigate('/home');
    }
  });

  const initialValues = {
    email: '',
    name: '',
    username: '',
    password: '',
  };

  const validationSchema = yup.object({
    email: yup.string().email().required('Email is required'),
    name: yup.string().required('Name is required'),
    username: yup.string().required('Username is required'),
    password: yup
      .string()
      .matches(passwordRegex, passwordErrorMessage)
      .required('Password is required'),
  });

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    setAlertMessage('');
    setIsAlertVisible(false);

    const { email, name, username, password } = values;
    const user = { email, name, username, password };

    try {
      await signUpUser(user);
      toast({
        title: 'Account Created',
        description: 'Your account has been created',
        status: 'success',
        variant: 'subtle',
        position: 'top',
        containerStyle: {
          zIndex: '9999',
        },
      });
      setTimeout(() => {
        resetForm(initialValues);
        setUserLoggedIn();
        setSubmitting(false);
        navigate('/home');
      }, 1000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ?? 'An unexpected error occurred';
      setAlertMessage(errorMessage);
      setIsAlertVisible(true);
      setSubmitting(false);
    }
  };

  return (
    <Flex justify="center" align="center" h="100vh">
      <Stack align="center" minW={{ base: '100%', lg: '50%', xl: '30%' }}>
        <Link to="/">
          <Image src={logo} alt="Memento logo" mb={5} />
        </Link>
        <Stack padding={9} paddingTop={0} align="center">
          <Heading as="h1">Sign Up</Heading>
          <Stack>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
              enableReinitialize
            >
              {({
                values,
                isSubmitting,
                resetForm,
                handleSubmit,
                errors,
                touched,
              }) => (
                <Form>
                  <FormControl
                    isRequired
                    isInvalid={errors.email && touched.email}
                  >
                    <FormLabel fontSize="16px" mt={5}>
                      Email Address
                    </FormLabel>
                    <Field
                      as={Input}
                      type="email"
                      name="email"
                      id="email"
                      mb={2}
                    />
                    <ErrorMessage name="email">
                      {(msg) => <Text color="red">{msg}</Text>}
                    </ErrorMessage>
                  </FormControl>

                  <FormControl
                    isRequired
                    isInvalid={errors.name && touched.name}
                  >
                    <FormLabel fontSize="16px" mt={5}>
                      Full Name
                    </FormLabel>
                    <Field
                      as={Input}
                      type="text"
                      name="name"
                      id="name"
                      mb={2}
                    />
                    <ErrorMessage name="name">
                      {(msg) => <Text color="red">{msg}</Text>}
                    </ErrorMessage>
                  </FormControl>
                  <FormControl
                    isRequired
                    isInvalid={errors.username && touched.username}
                  >
                    <FormLabel fontSize="16px" mt={5}>
                      Username
                    </FormLabel>
                    <FormHelperText>
                      Username cannot be changed later
                    </FormHelperText>
                    <Field
                      as={Input}
                      type="text"
                      name="username"
                      id="username"
                      my={2}
                    />
                    <ErrorMessage name="username">
                      {(msg) => <Text color="red">{msg}</Text>}
                    </ErrorMessage>
                  </FormControl>
                  <FormControl
                    isRequired
                    isInvalid={errors.password && touched.password}
                  >
                    <FormLabel fontSize="16px" mt={5}>
                      Password
                    </FormLabel>
                    <Field name="password" component={PasswordField} />
                    <ErrorMessage name="password">
                      {(msg) => (
                        <Text color="red" whiteSpace="pre-line">
                          {msg}
                        </Text>
                      )}
                    </ErrorMessage>
                  </FormControl>
                  {isAlertVisible && (
                    <Alert status="error" mt={5}>
                      <AlertIcon />
                      <Box maxW="200px">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{alertMessage}</AlertDescription>
                      </Box>
                    </Alert>
                  )}
                  <Button
                    colorScheme="blue"
                    type="submit"
                    w="100%"
                    mt={5}
                    isLoading={isSubmitting}
                  >
                    Sign up
                  </Button>
                </Form>
              )}
            </Formik>
            <Box position="relative" mt={5}>
              <Divider />
              <AbsoluteCenter bg="white" px="4">
                or
              </AbsoluteCenter>
            </Box>
            <Link to="/">
              <Button variant="outline" w="100%" mt={5}>
                Log in
              </Button>
            </Link>
          </Stack>
        </Stack>
      </Stack>
    </Flex>
  );
}
