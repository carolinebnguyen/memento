import React, { useEffect, useState } from 'react';
import {
  Flex,
  FormControl,
  HStack,
  Heading,
  useToast,
  Button,
  Center,
  Text,
  Box,
  Image,
  IconButton,
  VStack,
  Textarea,
  Select,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { IoMdClose } from 'react-icons/io';
import * as yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import DropZone from '../../components/Dropzone';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from '../../components/Sidebar/Sidebar.module.css';
import { getCurrentUsername } from '../../utils/userUtils';
import { createPost } from '../../utils/postUtils';

export default function Create() {
  const [file, setFile] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();
  const [hasDraft, setHasDraft] = useState(false);
  const [currentUsername, setCurrentUsername] = useState('');
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const fetchCurrentUserData = async () => {
      const username = await getCurrentUsername();
      setCurrentUsername(username);
      const draftPost = localStorage.getItem(`draftPost_${currentUsername}`);
      if (draftPost) {
        setHasDraft(true);
      }
    };
    fetchCurrentUserData();
  }, [currentUsername]);

  const initialValues = {
    type: 'status',
    imageSrc: '',
    text: '',
  };

  const validationSchema = yup.object({
    type: yup.string().required('Please select a type'),
    imageSrc: yup.string().when('type', {
      is: (type) => type === 'photo',
      then: (schema) => schema.required('Please upload a photo'),
      otherwise: (schema) => schema.notRequired(),
    }),
    text: yup.string().required('Text content is required'),
  });

  const removeFile = () => {
    if (file?.preview) {
      URL.revokeObjectURL(file.preview);
    }
    setFile(null);
  };

  const onSubmit = async (values, { setSubmitting }) => {
    setAlertMessage('');
    setIsAlertVisible(false);

    try {
      const { type, text } = values;
      let post = {};

      if (file) {
        post = { file, type, text };
      } else {
        post = { type, text };
      }

      await createPost(post);

      setTimeout(() => {
        setSubmitting(false);
        navigate(`/profile/${currentUsername}`);
        toast({
          title: 'Post Published',
          description: `Your ${type} has been published`,
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

  const savePhotoLocally = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const photoData = reader.result;
      localStorage.setItem(`draftPhoto_${currentUsername}`, photoData);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveDraft = (values) => {
    if (!values.text) {
      toast({
        title: 'Error',
        description: 'Please enter some text before saving your draft',
        status: 'error',
        duration: 3000,
        variant: 'subtle',
        position: 'top',
        containerStyle: {
          zIndex: '9999',
        },
      });
      return;
    }

    if (values.imageSrc) {
      savePhotoLocally(file);
    }

    localStorage.setItem(
      `draftPost_${currentUsername}`,
      JSON.stringify(values)
    );
    setTimeout(() => {
      toast({
        title: 'Draft Saved',
        description: `Your draft ${values.type} has been saved`,
        status: 'success',
        duration: 3000,
        variant: 'subtle',
        position: 'top',
        containerStyle: {
          zIndex: '9999',
        },
      });
      setHasDraft(true);
    }, 1000);
  };

  return (
    <Flex direction="column" align="center">
      <Heading as="h1" size="lg" mb={2}>
        Create a Post
      </Heading>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({
          values,
          isSubmitting,
          resetForm,
          handleSubmit,
          errors,
          touched,
          handleChange,
          setFieldValue,
        }) => {
          const updateImageSrc = (file) => {
            setFile(file);
            setFieldValue('imageSrc', file.preview);
          };
          return (
            <Form>
              <FormControl isInvalid={errors.type && errors.type}>
                <Center>
                  <VStack>
                    <Field
                      name="type"
                      as={Select}
                      value={values.type}
                      onChange={handleChange}
                      bgColor="#f7f7f7"
                    >
                      <option value="status">Status</option>
                      <option value="photo">Photo</option>
                    </Field>
                    <ErrorMessage name="type">
                      {(msg) => <Text color="red">{msg}</Text>}
                    </ErrorMessage>
                  </VStack>
                </Center>
              </FormControl>
              {values.type === 'photo' && (
                <>
                  {!file ? (
                    <>
                      <Box mt={5} mb={2}>
                        <DropZone setFile={updateImageSrc} />
                      </Box>
                      <ErrorMessage name="imageSrc">
                        {(msg) => <Text color="red">{msg}</Text>}
                      </ErrorMessage>
                    </>
                  ) : (
                    <Box position="relative" display="inline-block" mt={5}>
                      <Image
                        src={file.preview}
                        alt="Selected pic"
                        objectFit="cover"
                        boxSize={350}
                      />
                      <IconButton
                        onClick={removeFile}
                        colorScheme="gray"
                        icon={<IoMdClose />}
                        size="sm"
                        isRound={true}
                        aria-label="Remove Picture"
                        position="absolute"
                        top="8px"
                        right="8px"
                        opacity="80%"
                      />
                    </Box>
                  )}
                </>
              )}
              <FormControl>
                <Field
                  as={Textarea}
                  name="text"
                  id="text"
                  isInvalid={errors.text && touched.text}
                  mt={5}
                  placeholder={`Write a ${
                    values.type === 'photo' ? 'caption' : 'status'
                  }...`}
                />
                <Box my={2}>
                  <ErrorMessage name="text">
                    {(msg) => <Text color="red">{msg}</Text>}
                  </ErrorMessage>
                </Box>
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
                <Button
                  isDisabled={isSubmitting}
                  onClick={() => handleSaveDraft(values)}
                >
                  Save Draft
                </Button>
                <Button
                  colorScheme="blue"
                  type="submit"
                  isDisabled={isSubmitting}
                >
                  Publish Post
                </Button>
              </HStack>
            </Form>
          );
        }}
      </Formik>
      {hasDraft && (
        <Box mt={3}>
          <NavLink
            to={'/create/draft'}
            className={styles['footer-link']}
            style={{ color: 'steelblue' }}
          >
            View Draft
          </NavLink>
        </Box>
      )}
    </Flex>
  );
}
