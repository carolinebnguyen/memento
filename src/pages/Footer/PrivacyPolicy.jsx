import React from 'react';
import {
  Flex,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Textarea,
  useToast,
  Text,
} from '@chakra-ui/react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function PrivacyPolicy() {
  const toast = useToast();

  const initialValues = {
    name: '',
    email: '',
    subject: '',
    message: '',
  };

  const validationSchema = yup.object({
    name: yup.string().required('Name is required'),
    email: yup.string().email().required('Email is required'),
    subject: yup.string().required('Subject is required'),
    message: yup.string().required('Message is required'),
  });

  const onSubmit = (values, { setSubmitting, resetForm }) => {
    resetForm(initialValues);
    toast({
      title: 'Message Sent',
      description:
        'Thank you! Your message has been sent. We will get back to you within 5 business days.',
      status: 'success',
      duration: 5000,
      position: 'top',
    });
    setSubmitting(false);
  };

  return (
    <>
      <Navbar />
      <Flex justify="center" align="center" h="100vh">
        <Stack align="center" minW={{ base: '100%', lg: '50%', xl: '30%' }}>
          <Stack padding={9} paddingTop={0} align="center">
            <Heading as="h1">Contact Us</Heading>
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
                    <FormControl isRequired>
                      <FormLabel fontSize="16px" mt={5}>
                        Name
                      </FormLabel>
                      <Field
                        as={Input}
                        type="text"
                        name="name"
                        id="name"
                        isInvalid={errors.name && touched.name}
                        mb={2}
                      />
                      <ErrorMessage name="name">
                        {(msg) => <Text color="red">{msg}</Text>}
                      </ErrorMessage>
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel fontSize="16px" mt={5}>
                        Email Address
                      </FormLabel>
                      <Field
                        as={Input}
                        type="email"
                        name="email"
                        id="email"
                        isInvalid={errors.email && touched.email}
                        mb={2}
                      />
                      <ErrorMessage name="email">
                        {(msg) => <Text color="red">{msg}</Text>}
                      </ErrorMessage>
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel fontSize="16px" mt={5}>
                        Subject
                      </FormLabel>
                      <Field
                        as={Input}
                        type="text"
                        name="subject"
                        id="subject"
                        isInvalid={errors.subject && touched.subject}
                        mb={2}
                      />
                      <ErrorMessage name="subject">
                        {(msg) => <Text color="red">{msg}</Text>}
                      </ErrorMessage>
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel fontSize="16px" mt={5}>
                        Message
                      </FormLabel>
                      <Field
                        as={Textarea}
                        name="message"
                        id="message"
                        isInvalid={errors.message && touched.message}
                        mb={2}
                      />
                      <ErrorMessage name="message">
                        {(msg) => <Text color="red">{msg}</Text>}
                      </ErrorMessage>
                    </FormControl>
                    <Button
                      colorScheme="blue"
                      type="submit"
                      w="100%"
                      mt={5}
                      isLoading={isSubmitting}
                    >
                      Submit
                    </Button>
                  </Form>
                )}
              </Formik>
            </Stack>
          </Stack>
        </Stack>
      </Flex>
      <Footer />
    </>
  );
}
