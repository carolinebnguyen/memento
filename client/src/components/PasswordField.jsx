import React, { useState } from 'react';
import { Button, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { FaEyeSlash, FaEye } from 'react-icons/fa';

export default function PasswordField({ field, form, ...props }) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevIsPasswordVisible) => !prevIsPasswordVisible);
  };

  return (
    <InputGroup mb={2}>
      <Input
        {...field}
        type={isPasswordVisible ? 'text' : 'password'}
        id="password"
      />
      <InputRightElement>
        <Button
          onClick={togglePasswordVisibility}
          h="1.75rem"
          size="xs"
          colorScheme="whiteAlpha"
        >
          {isPasswordVisible ? (
            <FaEye size={22} color="black" />
          ) : (
            <FaEyeSlash size={22} color="black" />
          )}
        </Button>
      </InputRightElement>
    </InputGroup>
  );
}
