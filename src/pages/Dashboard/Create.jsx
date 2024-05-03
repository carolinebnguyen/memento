import React, { useState } from 'react';
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
import { useNavigate } from 'react-router-dom';

export default function Create() {
  const [file, setFile] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();

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

  return (
    <Flex direction="column" align="center" w="100vw">
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
                  mb={2}
                  placeholder={`Write a ${
                    values.type === 'photo' ? 'caption' : 'status'
                  }...`}
                />
                <ErrorMessage name="text">
                  {(msg) => <Text color="red">{msg}</Text>}
                </ErrorMessage>
              </FormControl>
              <HStack justify="center" mt={5} gap={5}>
                <Button isDisabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Draft'}
                </Button>
                <Button
                  colorScheme="blue"
                  type="submit"
                  isDisabled={isSubmitting}
                >
                  {isSubmitting ? 'Publishing...' : 'Publish Post'}
                </Button>
              </HStack>
            </Form>
          );
        }}
      </Formik>
    </Flex>
  );
}
