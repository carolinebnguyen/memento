import React, { useEffect } from 'react';
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
} from '@chakra-ui/react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../assets/logoBlack.png';
import PasswordField from '../../components/PasswordField';
import { passwordRegex, passwordErrorMessage } from '../../utils/utils';
import { setUserLoggedIn, isUserLoggedIn } from '../../utils/authUtils';

export default function Signup() {
  const navigate = useNavigate();

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

  const onSubmit = (values, { setSubmitting, resetForm }) => {
    setTimeout(() => {
      resetForm(initialValues);
      setUserLoggedIn();
      setSubmitting(false);
      navigate('/home');
    }, 1000);
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
                    <Field
                      as={Input}
                      type="text"
                      name="username"
                      id="username"
                      mb={2}
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
                  <Button
                    colorScheme="blue"
                    type="submit"
                    w="100%"
                    mt={10}
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
