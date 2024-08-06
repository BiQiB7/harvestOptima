'use client'
import React from 'react';
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Text,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

interface Props {
  children: React.ReactNode
  to: any
}

const Links = [
  { name: 'Advisor Bot', to: '/chatbot' },
  { name: 'IPM', to: '/ipm' },
  { name: 'Calculator', to: '/calculator' },
  { name: 'Discussion', to: '/forum' }
]

const NavLink = (props: Props) => {
  const { children, to } = props


  return (
    <Link to={to}>
      <Box
        as="span"
        px={2}
        py={1}
        rounded={'md'}
        transition="all 0.3s ease"
        _hover={{
          textDecoration: 'none',
          bg: 'green.500',
          color: 'white',
        }}>
        {children}
      </Box>
    </Link>
  )
}

export default function Simple() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const navigate = useNavigate();
  const toLandingPage = () => {
    navigate('/landing-page');
  };

  return (
    <>
      <Box bg='#004E36' style={{ color: '#FFFFFF' }} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            bg='#004E36'
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            <img width='100px' src="/icons/logo.png" onClick={toLandingPage} />
            <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
              {Links.map((link) => (
                <NavLink key={link.name} to={link.to}>{link.name}</NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={'center'}>
            <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}
              >
                <Avatar
                  size={'sm'}
                  src={
                    'https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                  }
                />
              </MenuButton>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link.name} to={link.to} >{link.name}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  )
}