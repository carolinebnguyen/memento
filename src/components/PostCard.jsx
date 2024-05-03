import React, { useState } from 'react';
import {
  Flex,
  Text,
  Stack,
  Avatar,
  useDisclosure,
  Heading,
  Tooltip,
  Button,
  Icon,
  Image,
  Center,
  useToast,
  FormControl,
  Textarea,
  HStack,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
  IconButton,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { getProfile, carolineProfile } from '../utils/testData';
import { FaRegHeart, FaHeart, FaRegComment, FaEllipsis } from 'react-icons/fa6';
import UserModal from './UserModal';
import { formatDateDistanceToNow, formatDate, PostType } from '../utils/utils';
import styles from '../components/BottomNav/BottomNav.module.css';
import ConfirmationModal from './ConfirmationModal';
import { Formik, Form, Field, ErrorMessage } from 'formik';

export default function PostCard({ post }) {
  const {
    id,
    postedBy,
    type,
    content,
    imageSrc,
    caption,
    likes,
    comments,
    postedAt,
  } = post;
  const [isLiked, setIsLiked] = useState(false);
  const [modifiedLikes, setModifiedLikes] = useState(likes);

  const user = getProfile(postedBy);
  const { username, picture } = user;
  const isOwnPost = postedBy === 'carolibn';
  const navigate = useNavigate();

  // get path to navigate user to proper page after deleting post
  const { pathname } = useLocation();
  const currentPathname = pathname;

  const {
    isOpen: isOpenLikes,
    onOpen: onOpenLikes,
    onClose: onCloseLikes,
  } = useDisclosure();

  // handle editing and deleting post
  const [isPostVisible, setIsPostVisible] = useState(true);
  const {
    isOpen: isOpenConfirmation,
    onOpen: onOpenConfirmation,
    onClose: onCloseConfirmation,
  } = useDisclosure();
  const toast = useToast();
  const [isEditable, setIsEditable] = useState(false);
  const [editedStatus, setEditedStatus] = useState(content);
  const [editedCaption, setEditedCaption] = useState(caption);

  const confirmDeletePost = () => {
    setTimeout(() => {
      setIsPostVisible(false);
      onCloseConfirmation();
      navigate(currentPathname);
      toast({
        title: 'Post Deleted',
        description: 'The post has been deleted',
        status: 'success',
        duration: 3000,
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
    content: editedStatus || '',
    caption: editedCaption || '',
  };

  const onSubmit = (values, { setSubmitting }) => {
    if (type === PostType.PHOTO) {
      setEditedCaption(values.caption);
    } else {
      setEditedStatus(values.status);
    }

    setTimeout(() => {
      setSubmitting(false);
      toggleEditMode();
      toast({
        title: 'Post Edited',
        description: 'Your post has been edited',
        status: 'success',
        duration: 3000,
        position: 'top',
        containerStyle: {
          zIndex: '9999',
        },
      });
    }, 1000);
  };

  const toggleIsLiked = () => {
    if (isLiked) {
      setModifiedLikes(
        modifiedLikes.filter((user) => user !== carolineProfile)
      );
    } else {
      setModifiedLikes([...modifiedLikes, carolineProfile]);
    }
    setIsLiked(!isLiked);
  };

  const handleUserNavigate = () => {
    navigate(`/profile?username=${postedBy}`);
  };

  const handlePostNavigate = () => {
    navigate(`/post?id=${id}`);
  };

  return (
    <>
      {isPostVisible ? (
        <Flex direction="column" w="100%">
          <Flex justify="space-between" gap={20} align="center">
            <Stack direction="row" align="center" gap={2}>
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
                    isOpen={isOpenConfirmation}
                    onClose={onCloseConfirmation}
                    title="Delete this post?"
                    message="Are you sure you want to delete this post? This action cannot be undone."
                    buttonLabel="Delete"
                    colorScheme="red"
                    onConfirm={confirmDeletePost}
                  />
                </>
              ) : (
                <>
                  <Avatar size="sm" src={picture} />
                  <Heading
                    as="h2"
                    size="xs"
                    _hover={{ textDecoration: 'underline', cursor: 'pointer' }}
                    onClick={handleUserNavigate}
                  >
                    {username}
                  </Heading>
                  <Tooltip
                    label={formatDate(postedAt)}
                    placement="bottom"
                    openDelay={500}
                  >
                    <Text
                      fontSize="xs"
                      color="gray"
                      _hover={{
                        textDecoration: 'underline',
                        cursor: 'pointer',
                      }}
                      onClick={handlePostNavigate}
                    >
                      {formatDateDistanceToNow(postedAt)}
                    </Text>
                  </Tooltip>
                </>
              )}
            </Stack>
            {isOwnPost ? (
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
                  <MenuItem
                    icon={<EditIcon />}
                    className={styles['menu-link']}
                    onClick={toggleEditMode}
                    fontSize="sm"
                  >
                    Edit Post
                  </MenuItem>
                  <MenuItem
                    icon={<DeleteIcon />}
                    onClick={onOpenConfirmation}
                    className={styles['menu-link']}
                    fontSize="sm"
                  >
                    Delete Post
                  </MenuItem>
                  <ConfirmationModal
                    isOpen={isOpenConfirmation}
                    onClose={onCloseConfirmation}
                    title="Delete this post?"
                    message="Are you sure you want to delete this post? This action cannot be undone."
                    buttonLabel="Delete"
                    colorScheme="red"
                    onConfirm={confirmDeletePost}
                  />
                </MenuList>
              </Menu>
            ) : null}
          </Flex>
          {type === PostType.STATUS ? (
            <Text fontSize="sm" my={2} textAlign="left">
              {content}
            </Text>
          ) : (
            <>
              <Center>
                <Image src={imageSrc} my={3} boxSize={500} objectFit="cover" />
              </Center>
              <Text fontSize="sm" mb={3} textAlign="left">
                {caption}
              </Text>
            </>
          )}
          <Flex justify="space-between">
            <Stack direction="row" gap={0}>
              <Button
                size="xs"
                colorScheme="whiteAlpha"
                onClick={toggleIsLiked}
              >
                <Icon
                  as={isLiked ? FaHeart : FaRegHeart}
                  boxSize={18}
                  color={isLiked ? 'skyblue' : 'gray'}
                  _hover={{ opacity: '50%' }}
                />
              </Button>
              <Button size="xs" colorScheme="whiteAlpha">
                <Icon
                  as={FaRegComment}
                  boxSize={18}
                  color="gray"
                  _hover={{ opacity: '50%' }}
                />
              </Button>
            </Stack>
            <Stack direction="row" gap={0}>
              <Text
                fontSize="xs"
                _hover={{ textDecoration: 'underline', cursor: 'pointer' }}
                onClick={onOpenLikes}
              >
                {modifiedLikes.length}{' '}
                {modifiedLikes.length === 1 ? 'like' : 'likes'}
              </Text>
              <UserModal
                isOpen={isOpenLikes}
                onClose={onCloseLikes}
                title="Liked By"
                usersList={modifiedLikes}
              />
              <Text fontSize="xs" whiteSpace="pre">
                {' '}
                •{' '}
              </Text>
              <Text
                fontSize="xs"
                _hover={{ textDecoration: 'underline', cursor: 'pointer' }}
                onClick={handlePostNavigate}
              >
                {comments.length}{' '}
                {comments.length === 1 ? 'comment' : 'comments'}
              </Text>
            </Stack>
          </Flex>
        </Flex>
      ) : null}
    </>
  );
}