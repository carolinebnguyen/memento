import React, { useContext, useEffect, useState } from 'react';
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
  useDisclosure,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
} from '@chakra-ui/react';
import { IoMdClose } from 'react-icons/io';
import * as yup from 'yup';
import { Formik, Form, Field, ErrorMessage, useFormikContext } from 'formik';
import DropZone from '../../components/Dropzone';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from '../../components/Sidebar/Sidebar.module.css';
import ConfirmationModal from '../../components/ConfirmationModal';
import { createPost } from '../../utils/postUtils';
import ErrorComponent from '../../components/ErrorComponent';
import { UserContext } from '../../contexts/UserContext';

export default function Drafts() {
  const toast = useToast();
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [type, setType] = useState('status');
  const [file, setFile] = useState(null);
  const [isFileLoaded, setIsFileLoaded] = useState(false);
  const [isFileChanged, setIsFileChanged] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { currentUser } = useContext(UserContext);
  const { username: currentUsername } = currentUser;
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [pageState, setPageState] = useState('LOADING');

  const fileName = `draftPhoto_${currentUsername}`;

  useEffect(() => {
    const setFileWithPreview = async (photoData) => {
      if (!photoData || isFileLoaded) {
        return;
      }
      const blob = await (await fetch(photoData)).blob();
      const extension = blob.type.slice(blob.type.indexOf('/') + 1);
      const file = new File([blob], `draftFile.${extension}`, {
        type: blob.type,
      });
      const fileWithPreview = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      setFile(fileWithPreview);
      setIsFileLoaded(true);
      setPageState('DONE');
    };

    const getPhotoFromIndexedDB = async (setPreview) => {
      const request = indexedDB.open('mementoPhotosDB', 1);

      request.onerror = (e) => {
        console.error('IndexedDB error:', e.target.error);
      };

      request.onsuccess = async (e) => {
        const db = e.target.result;
        const transaction = db.transaction(['photos'], 'readonly');
        const objectStore = transaction.objectStore('photos');
        const index = objectStore.index('fileName');
        const getRequest = index.get(fileName);

        getRequest.onsuccess = () => {
          const photoData = getRequest.result?.photoData;
          if (photoData) {
            setPreview(photoData);
          } else {
            console.error(`Photo ${fileName} not found in IndexedDB`);
          }
        };

        getRequest.onerror = (e) => {
          console.error(
            'Error retrieving photo from IndexedDB:',
            e.target.error
          );
        };
      };
    };

    const loadImageLocally = () => {
      getPhotoFromIndexedDB(setFileWithPreview);
    };

    const fetchCurrentUserData = async () => {
      try {
        const draftPostString = localStorage.getItem(
          `draftPost_${currentUsername}`
        );
        const draftPost = draftPostString ? JSON.parse(draftPostString) : {};
        if (Object.keys(draftPost).length === 0) {
          setPageState('NOT_FOUND');
          return;
        }
        const { type, text } = draftPost;
        setType(type);
        setText(text);
        if (type === 'photo' && !isFileLoaded) {
          await loadImageLocally();
        } else if (type === 'status') {
          setPageState('DONE');
        }
      } catch (error) {
        setPageState('ERROR');
      }
    };
    fetchCurrentUserData();
  }, [isFileLoaded, currentUsername, fileName]);

  const initialValues = {
    type: type,
    imageSrc: '',
    text: text,
  };

  const PhotoSetter = () => {
    const { setFieldValue } = useFormikContext();

    useEffect(() => {
      if (type === 'photo' && isFileLoaded) {
        setFieldValue('imageSrc', file);
      }
    }, [setFieldValue]);

    return null;
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

  const savePhotoLocally = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const photoData = reader.result;

      const request = indexedDB.open('mementoPhotosDB', 1);

      request.onerror = (e) => {
        console.error('IndexedDB error:', e.target.error);
      };

      request.onsuccess = (e) => {
        const db = e.target.result;

        const transaction = db.transaction(['photos'], 'readwrite');
        const objectStore = transaction.objectStore('photos');

        const fileName = `draftPhoto_${currentUsername}`;
        const data = { fileName: fileName, photoData: photoData };

        const putRequest = objectStore.put(data);

        putRequest.onerror = (e) => {
          console.error('Error saving photo in IndexedDB:', e.target.error);
        };
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('photos')) {
          const objectStore = db.createObjectStore('photos', {
            keyPath: 'fileName',
          });

          objectStore.createIndex('fileName', 'fileName', { unique: true });
        }
      };
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

    if (values.imageSrc && isFileChanged) {
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
    }, 1000);
  };

  const deletePhotoFromIndexedDB = () => {
    const request = indexedDB.open('mementoPhotosDB', 1);

    request.onerror = (e) => {
      console.error('IndexedDB error:', e.target.error);
    };

    request.onsuccess = (e) => {
      const db = e.target.result;
      const transaction = db.transaction(['photos'], 'readwrite');
      const objectStore = transaction.objectStore('photos');
      const index = objectStore.index('fileName');
      const getRequest = index.getKey(fileName);

      getRequest.onsuccess = () => {
        const photoName = getRequest.result;
        if (photoName) {
          const deleteRequest = objectStore.delete(photoName);
          deleteRequest.onerror = (e) => {
            console.error(
              `Error deleting photo ${fileName} from IndexedDB:`,
              e.target.error
            );
          };
        } else {
          console.error(`Photo ${fileName} not found in IndexedDB`);
        }
      };

      getRequest.onerror = (e) => {
        console.error('Error retrieving photo from IndexedDB:', e.target.error);
      };
    };
  };

  const removeLocalDraft = () => {
    deletePhotoFromIndexedDB();
    localStorage.removeItem(`draftPost_${currentUsername}`);
  };

  const confirmDeleteDraft = () => {
    removeLocalDraft();

    setTimeout(() => {
      onClose();
      navigate('/create');
      toast({
        title: 'Draft Deleted',
        description: 'Your draft has been deleted',
        status: 'success',
        duration: 3000,
        variant: 'subtle',
        position: 'top',
        containerStyle: {
          zIndex: '9999',
        },
      });
    }, 500);
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
        removeLocalDraft();
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

  if (pageState === 'LOADING') {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  } else if (pageState === 'ERROR') {
    return <ErrorComponent errorType="SERVER" />;
  } else if (pageState === 'NOT_FOUND') {
    return (
      <Flex direction="column" align="center" gap={5}>
        <Heading as="h1" size="lg" mb={2}>
          Drafts
        </Heading>
        <Text>No drafts to display</Text>
        <Box>
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

  return (
    <Flex direction="column" align="center">
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
            setIsFileChanged(true);
            setFieldValue('imageSrc', file.preview);
          };
          const removeFile = () => {
            if (file?.preview) {
              URL.revokeObjectURL(file.preview);
            }
            setFile(null);
            setFieldValue('imageSrc', '');
          };
          return (
            <Form>
              <PhotoSetter />
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
                        src={file.preview || file}
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
              <Flex justify="space-between" align="center" mt={5} gap={5}>
                <Button
                  colorScheme="red"
                  variant="ghost"
                  size="sm"
                  onClick={onOpen}
                >
                  Delete Draft
                </Button>
                <HStack justify="center" align="center" gap={3}>
                  <Button
                    isDisabled={isSubmitting}
                    onClick={() => handleSaveDraft(values)}
                    size="sm"
                  >
                    Save Draft
                  </Button>
                  <Button
                    colorScheme="blue"
                    type="submit"
                    isDisabled={isSubmitting}
                    size="sm"
                  >
                    Publish Post
                  </Button>
                </HStack>
              </Flex>
              <ConfirmationModal
                isOpen={isOpen}
                onClose={onClose}
                title="Delete this draft?"
                message="Are you sure you want to delete this draft? This action cannot be undone."
                buttonLabel="Delete"
                colorScheme="red"
                onConfirm={confirmDeleteDraft}
              />
            </Form>
          );
        }}
      </Formik>
      <Box mt={5}>
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
