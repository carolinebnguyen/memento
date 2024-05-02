import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaImage } from 'react-icons/fa6';
import { Input, Text, Flex } from '@chakra-ui/react';

export default function DropZone({ setFile }) {
  const [error, setError] = useState();

  const onDropAccepted = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      const fileWithPreview = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      setFile(fileWithPreview);
      setError('');
    },
    [setFile]
  );

  const onDropRejected = useCallback((fileRejections) => {
    const { errors } = fileRejections[0];
    if (errors[0].code === 'file-too-large') {
      setError('File is too large. The maximum file size is 5MB.');
    } else if (errors[0].code === 'file-invalid-type') {
      setError('Invalid file type. Please upload a JPEG, JPG, or PNG.');
    } else {
      setError('File could not be uploaded.');
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    onDropAccepted,
    onDropRejected,
    maxFiles: 1,
    maxSize: 5242880,
  });

  return (
    <Flex direction="column" align="center">
      <Flex
        {...getRootProps()}
        p={6}
        h="full"
        bgColor="gray.100"
        justify="center"
        align="center"
        borderRadius="lg"
      >
        <Input {...getInputProps()} className="hidden" />
        <Flex m={10} direction="column" align="center">
          <FaImage size={22} />
          <Text fontSize="md" mt={10}>
            Drag and drop an image here or
            <Text
              color="blue.400"
              _hover={{ textDecoration: 'underline', cursor: 'pointer' }}
            >
              browse
            </Text>
          </Text>
          <Text fontSize="sm" color="gray.500" mt={2}>
            Accepted file types: JPEG, JPG, PNG
          </Text>
        </Flex>
      </Flex>
      {error && (
        <Text color="red" fontSize="sm" mt={2}>
          {error}
        </Text>
      )}
    </Flex>
  );
}
