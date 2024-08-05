import React, { ReactNode } from 'react';
import { Box } from '@chakra-ui/react';

interface CardProps {
  children?: ReactNode;
}

const Card: React.FC<CardProps> = ({ children }) => {
  return (
    <Box
      alignItems="center"
      justifyContent="center"
      bg="white"
      boxShadow="md"
      p={4}
      borderRadius="md"
    >
      {children}
    </Box>
  );
}

export default Card;
