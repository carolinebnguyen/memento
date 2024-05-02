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
} from '@chakra-ui/react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import PasswordField from './PasswordField';
import { passwordRegex, passwordErrorMessage } from '../utils/utils';

export default function AccountInfoCard() {
  const [isEditable, setIsEditable] = useState(false);
  const toast = useToast();

  const initialValues = {
    newPassword: '',
    confirmPassword: '',
  };

  const validationSchema = yup.object().shape({
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
  };

  const onSubmit = (values, { setSubmitting }) => {
    setTimeout(() => {
      setSubmitting(false);
      toggleEditMode();
      toast({
        title: 'Password Changed',
        description: 'Your password has been changed',
        status: 'success',
        duration: 3000,
        position: 'top',
        containerStyle: {
          zIndex: '9999',
        },
      });
    }, 1000);
  };

  return (
    <Box>
      <Heading as="h2" size="sm" textTransform="uppercase" color="gray">
        Account
      </Heading>
      {isEditable ? (
        <Flex direction="column" w="50%" justify="center">
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
