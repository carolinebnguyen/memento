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
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../assets/logoBlack.png';
import PasswordField from '../../components/PasswordField';
import {
  setUserLoggedIn,
  isUserLoggedIn,
  logInUser,
} from '../../utils/authUtils';

export default function Login() {
  const navigate = useNavigate();
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alert, setAlert] = useState({
    status: '',
    title: '',
    message: '',
  });

  const initialValues = {
    username: '',
    password: '',
  };

  const validationSchema = yup.object({
    username: yup.string().required('Username is required'),
    password: yup.string().required('Password is required'),
  });

  useEffect(() => {
    if (isUserLoggedIn()) {
      navigate('/home');
    }
  }, [navigate]);

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    setIsAlertVisible(false);
    setAlert({ status: '', title: '', message: '' });

    const { username, password } = values;

    try {
      await logInUser(username, password);
      setAlert({
        status: 'success',
        title: 'Success!',
        message: 'Logging you in...',
      });
      setIsAlertVisible(true);
      setTimeout(() => {
        resetForm(initialValues);
        setUserLoggedIn();
        setSubmitting(false);
        navigate('/home');
      }, 1500);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ?? 'An unexpected error occurred';
      setAlert({ status: 'error', title: 'Error', message: errorMessage });
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
          <Heading as="h1">Log In</Heading>
          <Stack w="100%">
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
                  <FormControl isInvalid={errors.username && touched.username}>
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
                  <FormControl isInvalid={errors.password && touched.password}>
                    <FormLabel fontSize="16px" mt={5}>
                      Password
                    </FormLabel>
                    <Field name="password" component={PasswordField} />
                    <ErrorMessage name="password">
                      {(msg) => <Text color="red">{msg}</Text>}
                    </ErrorMessage>
                  </FormControl>
                  {isAlertVisible && (
                    <Alert status={alert.status} mt={5}>
                      <AlertIcon />
                      <Box maxW="200px">
                        <AlertTitle>{alert.title}</AlertTitle>
                        <AlertDescription>{alert.message}</AlertDescription>
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
                    Log in
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
            <Link to="/signup">
              <Button variant="outline" w="100%" mt={5}>
                Sign up
              </Button>
            </Link>
          </Stack>
        </Stack>
      </Stack>
    </Flex>
  );
}
