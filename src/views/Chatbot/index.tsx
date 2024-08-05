import React, { useState, useEffect, useRef } from 'react';
import { Flex, Grid, GridItem, Input, Button, VStack, Text, Box, useToast } from '@chakra-ui/react';
import { HfInference } from "@huggingface/inference";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const toast = useToast();

  const inference = new HfInference("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");

  const fetchHuggingFaceResponse = async (userMessage: string): Promise<void> => {
    setIsLoading(true);
    let fullResponse = '';
  
    try {
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
      
      for await (const chunk of inference.chatCompletionStream({
        model: "meta-llama/Meta-Llama-3-8B-Instruct",
        messages: [
          ...messages,
          { role: "user", content: userMessage }
        ],
        max_tokens: 500,
      })) {
        const content = chunk.choices[0]?.delta?.content || "";
        fullResponse += content;
        
        setMessages(prev => {
          const updatedMessages = [...prev];
          const lastMessage = updatedMessages[updatedMessages.length - 1];
          if (lastMessage.role === 'assistant') {
            lastMessage.content = fullResponse;
          }
          return updatedMessages;
        });
      }
    } catch (error) {
      console.error('Error fetching Hugging Face response:', error);
      toast({
        title: 'Error',
        description: 'Failed to get response from the server.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setMessages(prev => [
        ...prev, 
        { role: 'assistant', content: 'Sorry, I encountered an error while processing your request.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (input.trim() === '') return;
  
    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
  
    await fetchHuggingFaceResponse(input);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Grid templateRows="1fr auto" h="100vh">
      <GridItem overflowY="auto" p={4}>
        <VStack spacing={4} align="stretch">
          {messages.map((message, index) => (
            <Box
              key={index}
              bg={message.role === 'user' ? 'blue.100' : 'green.100'}
              p={2}
              borderRadius="md"
              alignSelf={message.role === 'user' ? 'flex-end' : 'flex-start'}
              maxW="70%"
            >
              <Text>{message.content}</Text>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </VStack>
      </GridItem>
      <GridItem>
        <Flex p={4}>
          <Input
            value={input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
            placeholder="Type your message..."
            mr={2}
            disabled={isLoading}
          />
          <Button onClick={handleSend} colorScheme="blue" isLoading={isLoading} loadingText="Sending">
            Send
          </Button>
        </Flex>
      </GridItem>
    </Grid>
  );
};

export default Chatbot;