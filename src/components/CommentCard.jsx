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
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { FaEllipsis } from 'react-icons/fa6';
import { getProfile } from '../utils/testData';
import { formatDate, formatDateDistanceToNow } from '../utils/utils';
import { useNavigate } from 'react-router-dom';
import styles from '../components/BottomNav/BottomNav.module.css';
import ConfirmationModal from './ConfirmationModal';

export default function CommentCard({ poster, comment }) {
  const { user, content, postedAt } = comment;
  const commenter = getProfile(user);
  const { username, picture } = commenter;
  const navigate = useNavigate();
  const [isCommentVisible, setIsCommentVisible] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isCommentSelfPosted = username === 'carolibn';
  const isOwnPost = poster === 'carolibn';

  const handleUserNavigation = () => {
    navigate(`/profile?username=${username}`);
  };

  const confirmDeleteComment = () => {
    setTimeout(() => {
      setIsCommentVisible(false);
      onClose();
    }, 500);
  };

  return (
    <Flex align="center" w="full" my={2}>
      {isCommentVisible ? (
        <Flex justify="space-between" w="100%">
          <Stack direction="row">
            <Avatar size="sm" src={picture} mr={2} />
            <Stack gap={0}>
              <HStack w="full" gap={1}>
                <Link color="black" onClick={handleUserNavigation}>
                  <Text as="b" fontSize="sm">
                    {username}
                  </Text>
                </Link>
                <Text fontSize="sm" fontWeight={400}>
                  {content}
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
          </Stack>
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
                  <MenuItem icon={<EditIcon />} className={styles['menu-link']}>
                    Edit Comment
                  </MenuItem>
                ) : null}
                <MenuItem
                  icon={<DeleteIcon />}
                  onClick={onOpen}
                  className={styles['menu-link']}
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
        </Flex>
      ) : null}
    </Flex>
  );
}
