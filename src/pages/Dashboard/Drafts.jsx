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
} from '@chakra-ui/react';
import { IoMdClose } from 'react-icons/io';
import * as yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import DropZone from '../../components/Dropzone';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from '../../components/Sidebar/Sidebar.module.css';

export default function Drafts() {
  const [file, setFile] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();
  const draftPostString = localStorage.getItem('draftPost');
  const draftPost = draftPostString ? JSON.parse(draftPostString) : {};
  const { type, imageSrc, text } = draftPost;

  const initialValues = {
    type: type || '',
    imageSrc: imageSrc || '',
    text: text || '',
  };

  useEffect(() => {
    console.log(imageSrc);
  }, []);

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

  const onSubmit = (values, { setSubmitting }) => {
    const type = values.type;
    setTimeout(() => {
      setSubmitting(false);
      navigate('/profile?username=carolibn');
      toast({
        title: 'Post Published',
        description: `Your ${type} has been published`,
        status: 'success',
        duration: 3000,
        position: 'top',
        containerStyle: {
          zIndex: '9999',
        },
      });
    }, 1000);
  };

  const handleSaveDraft = (values) => {
    localStorage.setItem('draftPost', values);
  };

  return (
    <Flex direction="column" align="center" w="100vw">
      <Heading as="h1" size="lg" mb={2}>
        Edit Draft
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
      <Box mt={3}>
        <NavLink
          to={'/create'}
          className={styles['footer-link']}
          style={{ color: 'steelblue' }}
        >
          Create New Post
        </NavLink>
      </Box>
    </Flex>
  );
}