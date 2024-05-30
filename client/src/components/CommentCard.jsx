import React, { useContext, useState } from 'react';
import {
  Flex,
  Avatar,
  Stack,
  HStack,
  Link,
  Tooltip,
  Text,
  useDisclosure,
  FormControl,
  useToast,
  Button,
  Textarea,
  Box,
} from '@chakra-ui/react';
import { formatDate, formatDateDistanceToNow } from '../utils/utils';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from './ConfirmationModal';
import CommentMenu from './CommentMenu';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { deleteComment, updateComment } from '../utils/commentUtils';
import { UserContext } from '../contexts/UserContext';

export default function CommentCard({ poster, comment, handleDeleteComment }) {
  const { username, text, postedAt, picture, commentId } = comment;
  const navigate = useNavigate();
  const [isCommentVisible, setIsCommentVisible] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { currentUser } = useContext(UserContext);

  const { username: currentUsername } = currentUser;

  const [isEditable, setIsEditable] = useState(false);
  const [editedComment, setEditedComment] = useState(text);

  const isCommentSelfPosted = username === currentUsername;
  const isOwnPost = poster === currentUsername;

  const handleUserNavigation = () => {
    navigate(`/profile/${username}`);
  };

  const confirmDeleteComment = async () => {
    try {
      await deleteComment(commentId);
      handleDeleteComment(commentId);
      setTimeout(() => {
        setIsCommentVisible(false);
        onClose();
        toast({
          title: 'Comment Deleted',
          description: 'The comment has been deleted',
          status: 'success',
          variant: 'subtle',
          position: 'top',
          containerStyle: {
            zIndex: '9999',
          },
        });
      }, 500);
    } catch (error) {
      onClose();
      toast({
        title: 'Error',
        description: 'The comment could not be deleted',
        status: 'error',
        variant: 'subtle',
        position: 'top',
        containerStyle: {
          zIndex: '9999',
        },
      });
    }
  };

  const toggleEditMode = () => {
    setIsEditable(!isEditable);
  };

  const initialValues = {
    text: editedComment.text || editedComment,
  };

  const onSubmit = async (values, { setSubmitting }) => {
    const { text: updatedText } = values;

    if (updatedText.trim() === '') {
      onOpen();
    } else {
      try {
        await updateComment(updatedText, commentId);

        setTimeout(() => {
          setSubmitting(false);
          toggleEditMode();
          setEditedComment(values);
          toast({
            title: 'Comment Edited',
            description: 'Your comment has been edited',
            status: 'success',
            variant: 'subtle',
            position: 'top',
            containerStyle: {
              zIndex: '9999',
            },
          });
        }, 1000);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Your comment could not be updated',
          status: 'error',
          variant: 'subtle',
          position: 'top',
          containerStyle: {
            zIndex: '9999',
          },
        });
      }
    }
  };

  if (!isCommentVisible) {
    return null;
  }

  return (
    <Flex align="center" w="full" my={2}>
      <Flex justify="space-between" w="100%">
        <Stack direction="row" w="full">
          <Avatar size="sm" src={picture} mr={2} />
          {isEditable ? (
            <Box w="full">
              <Formik
                initialValues={initialValues}
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
                    <FormControl isInvalid={errors.text && touched.text}>
                      <Field
                        as={Textarea}
                        type="text"
                        name="text"
                        id="text"
                        mb={2}
                        size="sm"
                        borderRadius={5}
                        rows="1"
                      />
                      <ErrorMessage name="text">
                        {(msg) => <Text color="red">{msg}</Text>}
                      </ErrorMessage>
                    </FormControl>
                    <HStack justify="flex-end" mt={2} gap={3}>
                      <Button onClick={toggleEditMode} size="xs">
                        Cancel
                      </Button>
                      <Button colorScheme="blue" type="submit" size="xs">
                        Save Changes
                      </Button>
                    </HStack>
                  </Form>
                )}
              </Formik>
              <ConfirmationModal
                isOpen={isOpen}
                onClose={onClose}
                title="Delete this comment?"
                message="Are you sure you want to delete this comment? This action cannot be undone."
                buttonLabel="Delete"
                colorScheme="red"
                onConfirm={confirmDeleteComment}
              />
            </Box>
          ) : (
            <>
              <Stack gap={0}>
                <HStack w="full" gap={2}>
                  <Link color="black" onClick={handleUserNavigation}>
                    <Text as="b" fontSize="sm">
                      {username}
                    </Text>
                  </Link>
                  <Tooltip
                    label={formatDate(postedAt)}
                    placement="bottom"
                    openDelay={500}
                  >
                    <Text fontSize="xs" color="gray" fontWeight={500}>
                      {formatDateDistanceToNow(postedAt)}
                    </Text>
                  </Tooltip>
                </HStack>
                <Text fontSize="sm" fontWeight={400} whiteSpace="pre-line">
                  {initialValues.text}
                </Text>
              </Stack>
            </>
          )}
        </Stack>
        {!isEditable && (isCommentSelfPosted || isOwnPost) && (
          <>
            <CommentMenu
              isCommentSelfPosted={isCommentSelfPosted}
              toggleEditMode={toggleEditMode}
              onOpen={onOpen}
            />
            <ConfirmationModal
              isOpen={isOpen}
              onClose={onClose}
              title="Delete this comment?"
              message="Are you sure you want to delete this comment? This action cannot be undone."
              buttonLabel="Delete"
              colorScheme="red"
              onConfirm={confirmDeleteComment}
            />
          </>
        )}
      </Flex>
    </Flex>
  );
}
