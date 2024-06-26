import React, { useState } from 'react';
import {
  Flex,
  Box,
  Button,
  Heading,
  useToast,
  HStack,
  FormControl,
  FormLabel,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import PasswordField from './PasswordField';
import { passwordRegex, passwordErrorMessage } from '../utils/utils';
import { updatePassword } from '../utils/authUtils';

export default function AccountInfoCard() {
  const [isEditable, setIsEditable] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const toast = useToast();

  const initialValues = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  const validationSchema = yup.object().shape({
    currentPassword: yup.string().when(['newPassword'], {
      is: (newPassword) => newPassword,
      then: (schema) => schema.required('Please enter your current password'),
      otherwise: (schema) => schema.nullable(),
    }),
    newPassword: yup
      .string()
      .nullable()
      .matches(passwordRegex, passwordErrorMessage)
      .transform((value) => value || null),
    confirmPassword: yup.string().when(['newPassword'], {
      is: (newPassword) => newPassword,
      then: (schema) =>
        schema
          .required('Please confirm your new password')
          .oneOf(
            [yup.ref('newPassword'), null, ''],
            'Passwords must both match'
          ),
      otherwise: (schema) => schema.nullable(),
    }),
  });

  const toggleEditMode = () => {
    setIsEditable(!isEditable);
    setAlertMessage('');
    setIsAlertVisible(false);
  };

  const onSubmit = async (values, { setSubmitting }) => {
    setAlertMessage('');
    setIsAlertVisible(false);

    const { currentPassword, newPassword } = values;

    try {
      await updatePassword(currentPassword, newPassword);
      setTimeout(() => {
        setSubmitting(false);
        toggleEditMode();
        toast({
          title: 'Password Changed',
          description: 'Your password has been changed',
          status: 'success',
          duration: 3000,
          variant: 'subtle',
          position: 'top',
          containerStyle: {
            zIndex: '9999',
          },
        });
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
    <Box w="full">
      <Heading as="h2" size="sm" textTransform="uppercase" color="gray">
        Account
      </Heading>
      {isEditable ? (
        <Flex
          direction="column"
          w={{ base: '100%', sm: '60%', md: '50%' }}
          justify="center"
        >
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
                  isInvalid={errors.currentPassword && touched.currentPassword}
                >
                  <FormLabel fontSize="16px" mt={5}>
                    Current Password
                  </FormLabel>
                  <Field name="currentPassword" component={PasswordField} />
                  <ErrorMessage name="currentPassword">
                    {(msg) => (
                      <Text color="red" whiteSpace="pre-line">
                        {msg}
                      </Text>
                    )}
                  </ErrorMessage>
                </FormControl>
                <FormControl
                  isInvalid={errors.newPassword && touched.newPassword}
                >
                  <FormLabel fontSize="16px" mt={5}>
                    New Password
                  </FormLabel>
                  <Field name="newPassword" component={PasswordField} />
                  <ErrorMessage name="newPassword">
                    {(msg) => (
                      <Text color="red" whiteSpace="pre-line">
                        {msg}
                      </Text>
                    )}
                  </ErrorMessage>
                </FormControl>
                <FormControl
                  isInvalid={errors.confirmPassword && touched.confirmPassword}
                >
                  <FormLabel fontSize="16px" mt={5}>
                    Confirm Password
                  </FormLabel>
                  <Field name="confirmPassword" component={PasswordField} />
                  <ErrorMessage name="confirmPassword">
                    {(msg) => <Text color="red">{msg}</Text>}
                  </ErrorMessage>
                </FormControl>
                {isAlertVisible && (
                  <Alert status="error" mt={5}>
                    <AlertIcon />
                    <Box>
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{alertMessage}</AlertDescription>
                    </Box>
                  </Alert>
                )}
                <HStack justify="center" mt={5} gap={5}>
                  <Button isDisabled={isSubmitting} onClick={toggleEditMode}>
                    Cancel
                  </Button>
                  <Button
                    colorScheme="blue"
                    type="submit"
                    isDisabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                </HStack>
              </Form>
            )}
          </Formik>
        </Flex>
      ) : (
        <Button my={5} onClick={toggleEditMode}>
          Change Password
        </Button>
      )}
    </Box>
  );
}
