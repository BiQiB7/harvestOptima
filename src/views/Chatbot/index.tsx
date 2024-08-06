import React, { useState, useEffect, useRef } from 'react';
import { Select, Flex, Grid, GridItem, Input, Button, VStack, Text, Box, useToast, IconButton, Slider, SliderTrack, SliderFilledTrack, SliderThumb } from '@chakra-ui/react';
import { HfInference } from "@huggingface/inference";
import { FaPlay, FaPause } from 'react-icons/fa';
import Navbar from "../../components/Navbar"
import HelpButton from '../../components/HelpButton';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    isComplete?: boolean;
    audioProgress?: number;
    isPlaying?: boolean;
    audioDuration?: number;
}
const Chatbot: React.FC = () => {
    const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
    const [currentAudioIndex, setCurrentAudioIndex] = useState<number | null>(null);
    const [audioProgress, setAudioProgress] = useState<number>(0);
    const audioStartTimeRef = useRef<number | null>(null);
    const audioDurationRef = useRef<number | null>(null);
    const audioIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const userSelectedProgressRef = useRef<number | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const toast = useToast();
    const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

    const inference = new HfInference("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");

    const fetchHuggingFaceResponse = async (userMessage: string): Promise<void> => {
        setIsLoading(true);
        let fullResponse = '';

        try {
            setMessages(prev => [...prev, { role: 'assistant', content: '', isComplete: false }]);

            const languagePrompt = selectedLanguage === 'id'
                ? "Please respond in Indonesian. "
                : "";


            for await (const chunk of inference.chatCompletionStream({
                model: "meta-llama/Meta-Llama-3-8B-Instruct",
                messages: [
                    { role: "system", content: `${languagePrompt}Respond to the user's message.` },
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

            setMessages(prev => {
                const updatedMessages = [...prev];
                const lastMessage = updatedMessages[updatedMessages.length - 1];
                if (lastMessage.role === 'assistant') {
                    lastMessage.isComplete = true;
                }
                return updatedMessages;
            });
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
                { role: 'assistant', content: 'Sorry, I encountered an error while processing your request.', isComplete: true }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSend = async () => {
        if (input.trim() === '') return;

        const userMessage: Message = { role: 'user', content: input, isComplete: true };
        setMessages(prev => [...prev, userMessage]);
        setInput('');

        await fetchHuggingFaceResponse(input);
    };

    const speakMessage = (text: string, index: number, startFrom: number = 0) => {
        if ('speechSynthesis' in window) {
            if (speechSynthesisRef.current) {
                speechSynthesis.cancel();
            }
            if (audioIntervalRef.current) {
                clearInterval(audioIntervalRef.current);
            }

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = selectedLanguage === 'id' ? 'id-ID' : 'en-US';
            const voices = speechSynthesis.getVoices();
            console.log("voices"+voices)
            const voice = voices.find(v => v.lang === utterance.lang);
            if (voice) {
                utterance.voice = voice;
                console.log(voice)
            }

            utterance.onstart = () => {
                setIsSpeaking(true);
                setCurrentAudioIndex(index);
                audioStartTimeRef.current = Date.now() - startFrom;
                audioDurationRef.current = text.length * 50; // Rough estimate: 50ms per character
                audioIntervalRef.current = setInterval(() => {
                    if (audioStartTimeRef.current && audioDurationRef.current) {
                        const elapsedTime = Date.now() - audioStartTimeRef.current;
                        const progress = (elapsedTime / audioDurationRef.current) * 100;
                        setAudioProgress(Math.min(progress, 100));
                    }
                }, 100);
            };
            utterance.onend = () => {
                setIsSpeaking(false);
                setCurrentAudioIndex(null);
                setAudioProgress(0);
                audioStartTimeRef.current = null;
                audioDurationRef.current = null;
                userSelectedProgressRef.current = null;
                if (audioIntervalRef.current) {
                    clearInterval(audioIntervalRef.current);
                }
            };
            utterance.onerror = () => {
                if (audioIntervalRef.current) {
                    clearInterval(audioIntervalRef.current);
                }
            };
            speechSynthesisRef.current = utterance;
            speechSynthesis.speak(utterance);
        } else {
            toast({
                title: 'Error',
                description: 'Text-to-speech is not supported in your browser.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };
    const pauseAudio = () => {
        if (speechSynthesisRef.current) {
            speechSynthesis.pause();
            setIsSpeaking(false);
            if (audioIntervalRef.current) {
                clearInterval(audioIntervalRef.current);
            }
        }
    };


    const resumeAudio = () => {
        if (speechSynthesisRef.current && currentAudioIndex !== null) {
            speechSynthesis.resume();
            setIsSpeaking(true);
            const currentProgress = userSelectedProgressRef.current !== null ? userSelectedProgressRef.current : audioProgress;
            audioStartTimeRef.current = Date.now() - (currentProgress / 100) * (audioDurationRef.current || 0);
            audioIntervalRef.current = setInterval(() => {
                if (audioStartTimeRef.current && audioDurationRef.current) {
                    const elapsedTime = Date.now() - audioStartTimeRef.current;
                    const progress = (elapsedTime / audioDurationRef.current) * 100;
                    setAudioProgress(Math.min(progress, 100));
                }
            }, 100);
        }
    };

    const handleAudioProgressChange = (value: number) => {
        if (speechSynthesisRef.current && currentAudioIndex !== null) {
            const message = messages[currentAudioIndex];
            const charIndex = Math.floor((value / 100) * message.content.length);
            speechSynthesis.cancel();
            if (audioIntervalRef.current) {
                clearInterval(audioIntervalRef.current);
            }
            setAudioProgress(value);
            userSelectedProgressRef.current = value;
            const startFrom = (value / 100) * (audioDurationRef.current || 0);
            speakMessage(message.content.slice(charIndex), currentAudioIndex, startFrom);
        }
    };

    useEffect(() => {
        return () => {
            if (audioIntervalRef.current) {
                clearInterval(audioIntervalRef.current);
            }
        };
    }, []);

    return (
        <Flex direction="column">
            <Navbar />
            <Flex direction="row" gap="10px" style={{ margin: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                <Flex style={{ width: 'fit-content' }}>
                    <Select value={selectedLanguage} onChange={(e: any) => setSelectedLanguage(e.target.value)}>
                        <option value="en">English</option>
                        <option value="id">Indonesian</option>
                    </Select>
                </Flex>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <HelpButton />
                </div>
            </Flex>
            <Grid templateRows="1fr auto" h="75vh">
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
                                position="relative"
                            >
                                <Text>{message.content}</Text>
                                {message.role === 'assistant' && message.isComplete && (
                                    <Flex direction="column" mt={2}>
                                        <IconButton
                                            aria-label={isSpeaking && currentAudioIndex === index ? "Pause" : "Play"}
                                            icon={isSpeaking && currentAudioIndex === index ? <FaPause /> : <FaPlay />}
                                            size="sm"
                                            alignSelf="flex-end"
                                            onClick={() => {
                                                if (isSpeaking && currentAudioIndex === index) {
                                                    pauseAudio();
                                                } else if (!isSpeaking && currentAudioIndex === index) {
                                                    resumeAudio();
                                                } else {
                                                    speakMessage(message.content, index);
                                                }
                                            }}
                                        />
                                        {currentAudioIndex === index && (
                                            <Slider
                                                aria-label="audio-progress"
                                                value={userSelectedProgressRef.current !== null ? userSelectedProgressRef.current : audioProgress}
                                                onChange={(value) => {
                                                    userSelectedProgressRef.current = value;
                                                    setAudioProgress(value);
                                                }}
                                                onChangeEnd={handleAudioProgressChange}
                                                mt={2}
                                            >
                                                <SliderTrack>
                                                    <SliderFilledTrack />
                                                </SliderTrack>
                                                <SliderThumb />
                                            </Slider>
                                        )}
                                    </Flex>
                                )}
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
        </Flex>
    );
};

export default Chatbot;