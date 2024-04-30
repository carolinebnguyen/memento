import React from 'react';
import { useTab, Button, useMultiStyleConfig, Icon } from '@chakra-ui/react';
import { AiOutlinePicture, AiFillPicture } from 'react-icons/ai';
import { IoMegaphoneOutline, IoMegaphoneSharp } from 'react-icons/io5';

const PostTab = React.forwardRef((props, ref) => {
  const tabProps = useTab({ ...props, ref });
  const isSelected = !!tabProps['aria-selected'];

  const styles = useMultiStyleConfig('Tabs', tabProps);

  return (
    <Button __css={styles.tab} {...tabProps}>
      <Icon as={isSelected ? AiFillPicture : AiOutlinePicture} mr="2" />
      {tabProps.children}
    </Button>
  );
});

const StatusTab = React.forwardRef((props, ref) => {
  const tabProps = useTab({ ...props, ref });
  const isSelected = !!tabProps['aria-selected'];

  const styles = useMultiStyleConfig('Tabs', tabProps);

  return (
    <Button __css={styles.tab} {...tabProps}>
      <Icon as={isSelected ? IoMegaphoneSharp : IoMegaphoneOutline} mr="2" />
      {tabProps.children}
    </Button>
  );
});

export { PostTab, StatusTab };