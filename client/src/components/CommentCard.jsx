import React, { useState } from 'react';
import {
  Flex,
  Avatar,
  Stack,
  HStack,
  Link,
  Tooltip,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useDisclosure,
  FormControl,
  useToast,
  Button,
  Textarea,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { FaEllipsis } from 'react-icons/fa6';
import { getProfile } from '../utils/testData';
import { formatDate, formatDateDistanceToNow } from '../utils/utils';
import { useNavigate } from 'react-router-dom';
import styles from '../components/BottomNav/BottomNav.module.css';
import ConfirmationModal from './ConfirmationModal';
import { Formik, Form, Field, ErrorMessage } from 'formik';

export default function CommentCard({ poster, comment }) {
  const { user, content, postedAt } = comment;
  const commenter = getProfile(user);
  const { username, picture } = commenter;
  const navigate = useNavigate();
  const [isCommentVisible, setIsCommentVisible] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [isEditable, setIsEditable] = useState(false);
  const [editedComment, setEditedComment] = useState(content);

  const isCommentSelfPosted = username === 'carolibn';
  const isOwnPost = poster === 'carolibn';

  const handleUserNavigation = () => {
    navigate(`/profile/${username}`);
  };

  const confirmDeleteComment = () => {
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
  };

  const toggleEditMode = () => {
    setIsEditable(!isEditable);
  };

  const initialValues = {
    content: editedComment.content || editedComment,
  };

  const onSubmit = (values, { setSubmitting }) => {
    if (values.content === '') {
      onOpen();
    } else {
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
    }
  };

  return (
    <>
      {isCommentVisible ? (
        <Flex align="center" w="full" my={2}>
          <Flex justify="space-between" w="100%">
            <Stack direction="row">
              {isEditable ? (
                <>
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
                        <FormControl
                          isInvalid={errors.content && touched.content}
                        >
                          <Field
                            as={Textarea}
                            type="text"
                            name="content"
                            id="content"
                            mb={2}
                            size="sm"
                            borderRadius={5}
                            rows="1"
                          />
                          <ErrorMessage name="content">
                            {(msg) => <Text color="red">{msg}</Text>}
                          </ErrorMessage>
                        </FormControl>
                        <HStack justify="center" mt={2} gap={3}>
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
                </>
              ) : (
                <>
                  <Avatar size="sm" src={picture} mr={2} />
                  <Stack gap={0}>
                    <HStack w="full" gap={1}>
                      <Link color="black" onClick={handleUserNavigation}>
                        <Text as="b" fontSize="sm">
                          {username}
                        </Text>
                      </Link>
                      <Text fontSize="sm" fontWeight={400}>
                        {initialValues.content}
                      </Text>
                    </HStack>
                    <Tooltip
                      label={formatDate(postedAt)}
                      placement="bottom"
                      openDelay={500}
                    >
                      <Text fontSize="xs" color="gray" fontWeight={500}>
                        {formatDateDistanceToNow(postedAt)}
                      </Text>
                    </Tooltip>
                  </Stack>
                </>
              )}
            </Stack>
            {isEditable ? null : (
              <>
                {isCommentSelfPosted || isOwnPost ? (
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      aria-label="Options"
                      icon={<FaEllipsis />}
                      variant="ghost"
                      color="gray"
                      size="xs"
                    />
                    <MenuList>
                      {isCommentSelfPosted ? (
                        <MenuItem
                          icon={<EditIcon />}
                          className={styles['menu-link']}
                          onClick={toggleEditMode}
                          fontSize="sm"
                        >
                          Edit Comment
                        </MenuItem>
                      ) : null}
                      <MenuItem
                        icon={<DeleteIcon />}
                        onClick={onOpen}
                        className={styles['menu-link']}
                        fontSize="sm"
                      >
                        Delete Comment
                      </MenuItem>
                      <ConfirmationModal
                        isOpen={isOpen}
                        onClose={onClose}
                        title="Delete this comment?"
                        message="Are you sure you want to delete this comment? This action cannot be undone."
                        buttonLabel="Delete"
                        colorScheme="red"
                        onConfirm={confirmDeleteComment}
                      />
                    </MenuList>
                  </Menu>
                ) : null}
              </>
            )}
          </Flex>
        </Flex>
      ) : null}
    </>
  );
}
