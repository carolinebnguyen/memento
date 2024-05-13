import React, { useState } from 'react';
import {
  Heading,
  Text,
  Box,
  Stack,
  IconButton,
  Flex,
  Avatar,
  AvatarBadge,
  Button,
  HStack,
  useToast,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react';
import { MdOutlinePhotoCamera } from 'react-icons/md';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { carolineProfile } from '../utils/testData';
import ChangePictureModal from './ChangePictureModal';

export default function ProfileInfoCard() {
  const { picture } = carolineProfile;
  const [isEditable, setIsEditable] = useState(false);
  const [editedProfileInfo, setEditedProfileInfo] = useState(carolineProfile);
  const [avatarSrc, setAvatarSrc] = useState(picture);
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialValues = {
    email: editedProfileInfo.email,
    username: editedProfileInfo.username,
    name: editedProfileInfo.name,
    bio: editedProfileInfo.bio,
  };

  const validationSchema = yup.object({
    email: yup.string().email().required('Email is required'),
    username: yup.string().required('Username is required'),
    name: yup.string().required('Name is required'),
    bio: yup.string().max(150, 'Biography must be at most 150 characters'),
  });

  const toggleEditMode = () => {
    setIsEditable(!isEditable);
  };

  const handleSetAvatarSrc = (src) => {
    setAvatarSrc(src);
  };

  const onSubmit = (values, { setSubmitting }) => {
    setTimeout(() => {
      setSubmitting(false);
      setEditedProfileInfo(values);
      toggleEditMode();
      toast({
        title: 'Changes Saved',
        description: 'Your profile changes have been saved',
        status: 'success',
        variant: 'subtle',
        position: 'top',
        containerStyle: {
          zIndex: '9999',
        },
      });
    }, 1000);
  };

  return (
    <Box w="full">
      <Heading as="h2" size="sm" textTransform="uppercase" color="gray">
        Profile
      </Heading>
      <Stack direction="row" justifyContent="space-between" px={5} mt={5}>
        <Avatar size="2xl" src={avatarSrc}>
          <AvatarBadge
            as={IconButton}
            size="md"
            rounded="full"
            bottom="10px"
            colorScheme="gray"
            aria-label="Change Profile Picture"
            icon={<MdOutlinePhotoCamera />}
            onClick={onOpen}
          />
        </Avatar>
        <ChangePictureModal
          isOpen={isOpen}
          onClose={onClose}
          setAvatarSrc={handleSetAvatarSrc}
        />
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
                    isInvalid={errors.name && touched.name}
                  >
                    <FormLabel fontSize="16px" mt={5}>
                      Name
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
                  <FormControl>
                    <FormLabel fontSize="16px" mt={5}>
                      Biography
                    </FormLabel>
                    <Field
                      as={Textarea}
                      name="bio"
                      id="bio"
                      isInvalid={errors.bio && touched.bio}
                      mb={2}
                    />
                    <ErrorMessage name="bio">
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
          <Flex direction="column" w="50%" justify="center">
            <Stack pt={2} gap={0}>
              <Text as="b" fontSize="sm">
                Email
              </Text>
              <Text fontSize="sm">{initialValues.email}</Text>
            </Stack>
            <Stack pt={2} gap={0}>
              <Text as="b" fontSize="sm">
                Username
              </Text>
              <Text fontSize="sm">{initialValues.username}</Text>
            </Stack>
            <Stack pt={2} gap={0}>
              <Text as="b" fontSize="sm">
                Name
              </Text>
              <Text fontSize="sm">{initialValues.name}</Text>
            </Stack>
            <Stack pt={2} gap={0} mb={5}>
              <Text as="b" fontSize="sm">
                Biography
              </Text>
              {initialValues.bio ? (
                <Text fontSize="sm" whiteSpace="pre-line">
                  {initialValues.bio}
                </Text>
              ) : (
                <Text as="i" fontSize="sm">
                  No bio
                </Text>
              )}
            </Stack>
            <Button onClick={toggleEditMode}>Edit Profile</Button>
          </Flex>
        )}
      </Stack>
    </Box>
  );
}
