import React, { useState, useEffect, useRef } from 'react';
import { Select, Flex, Grid, GridItem, Input, Button, VStack, Text, Box, useToast, IconButton, Slider, SliderTrack, SliderFilledTrack, SliderThumb } from '@chakra-ui/react';
import { HfInference } from "@huggingface/inference";
import { FaPlay, FaPause } from 'react-icons/fa';
import Navbar from "../../components/Navbar"
import HelpButton from '../../components/HelpButton';
import stringSimilarity from 'string-similarity-js';
import { ChatMistralAI } from "@langchain/mistralai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { MistralAIEmbeddings } from "@langchain/mistralai";
interface CropInfo {
    crop_name: string;
    recommended_nitrogen: number;
    recommended_potassium: number;
    recommended_phosphorus: number;
    rotatable_with: string[];
}
interface Crop {
    crop_name: string;
    recommended_nitrogen: number;
    recommended_potassium: number;
    recommended_phosphorus: number;
    rotatable_with: Array<string>;
}

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
    const [vectorStore, setVectorStore] = useState<MemoryVectorStore | null>(null);
    useEffect(() => {
        initializeVectorStore();
    }, []);
    const initializeVectorStore = async () => {
        try {
            // Fetch initial crop data with some default keywords
            const initialCropData = await fetchCropData(['crop', 'nutrient', 'rotation']);
            const vectorStore = await MemoryVectorStore.fromTexts(
                initialCropData.map(crop => JSON.stringify(crop)),
                initialCropData.map(crop => ({ id: crop.crop_name })),
                embeddings
            );
            setVectorStore(vectorStore);
        } catch (error) {
            console.error('Failed to initialize vector store:', error);
            toast({
                title: 'Initialization Error',
                description: 'Failed to load initial crop data.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const embeddings = new MistralAIEmbeddings({
        apiKey: "8Io7H50D1h2YvlUdcK5uIvRQQjc8Wqaw"
        // process.env.MISTRAL_API_KEY,
    });

    const fetchCropData = async (keywords: string[]): Promise<CropInfo[]> => {
        const response = await fetch('http://localhost:3001/api/query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ keywords }),
        });
        if (!response.ok) {
            throw new Error('Failed to fetch crop data');
        }
        return await response.json();
    };
    const updateVectorStore = async (cropData: CropInfo[]) => {
        if (vectorStore) {
            await vectorStore.addDocuments(
                cropData.map(crop => ({
                    pageContent: JSON.stringify(crop),
                    metadata: { id: crop.crop_name },
                }))
            );
        } else {
            const newVectorStore = await MemoryVectorStore.fromTexts(
                cropData.map(crop => JSON.stringify(crop)),
                cropData.map(crop => ({ id: crop.crop_name })),
                embeddings
            );
            setVectorStore(newVectorStore);
        }
    };
    const generateRAGResponse = async (userMessage: string): Promise<string> => {
        const keywords = userMessage.toLowerCase().split(/\s+/).filter(word => word.length > 3);
        
        const cropData = await fetchCropData(keywords);
        await updateVectorStore(cropData);

        if (!vectorStore) {
            throw new Error("Vector store not initialized");
        }

        const model = new ChatMistralAI({
            apiKey: "8Io7H50D1h2YvlUdcK5uIvRQQjc8Wqaw",
            // process.env.MISTRAL_API_KEY,
            modelName: "mistral-tiny",
        });

        const retriever = vectorStore.asRetriever();

        const prompt = PromptTemplate.fromTemplate(`
            You are an AI assistant specializing in agricultural advice. Use the following context to answer the user's question:
            Context: {context}
            
            Human: {question}
            AI: `);

        const chain = RunnableSequence.from([
            {
                context: retriever.pipe(docs => docs.map(doc => doc.pageContent).join("\n")),
                question: (input: string) => input,
            },
            prompt,
            model,
            new StringOutputParser(),
        ]);

        const response = await chain.invoke(userMessage);
        return response;
    };


    const handleSend = async () => {
        if (input.trim() === '') return;

        const userMessage: Message = { role: 'user', content: input, isComplete: true };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await generateRAGResponse(input);
            setMessages(prev => [...prev, { role: 'assistant', content: response, isComplete: true }]);
        } catch (error) {
            console.error('Error generating response:', error);
            toast({
                title: 'Error',
                description: 'Failed to generate response.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Add this function to query the database
    // const queryDatabase = async (keywords: string[]): Promise<Crop[]> => {
    //     try {
    //         const response = await fetch('http://localhost:3001/api/query', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ keywords }),
    //         });

    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }

    //         return await response.json();
    //     } catch (error) {
    //         console.error('Error querying database:', error);
    //         return [];
    //     }
    // };

    const generateDatabaseResponse = (crops: Crop[], userMessage: string): string => {
        const words = userMessage.toLowerCase().split(/\s+/);
    
        // Function to find the best match for a word in a list of options
        const findBestMatch = (word: string, options: string[]): string | null => {
            const ratings = options.map(option => ({
                target: option,
                rating: stringSimilarity(word, option)
            }));
            const bestMatch = ratings.reduce((best, current) => 
                current.rating > best.rating ? current : best
            );
            return bestMatch.rating > 0.5 ? bestMatch.target : null;
        };
    
        // Check if the query is about what to plant after a specific crop
        const afterIndex = words.indexOf('after');
        if (afterIndex !== -1 && afterIndex < words.length - 1) {
            // Extract potential crop names (up to 3 words after "after")
            const potentialCropNames = [
                words[afterIndex + 1],
                words.slice(afterIndex + 1, afterIndex + 3).join(' '),
                words.slice(afterIndex + 1, afterIndex + 4).join(' ')
            ];
    
            // Find the best matching crop
            let matchedCrop: Crop | undefined;
            for (const cropName of potentialCropNames) {
                matchedCrop = crops.find(crop => 
                    findBestMatch(cropName, [crop.crop_name.toLowerCase()]) !== null
                );
                if (matchedCrop) break;
            }
    
            if (matchedCrop && matchedCrop.rotatable_with && matchedCrop.rotatable_with.length > 0) {
                return `After ${matchedCrop.crop_name}, you can plant: ${matchedCrop.rotatable_with.join(', ')}.`;
            } else if (matchedCrop) {
                return `I don't have specific rotation information for ${matchedCrop.crop_name}.`;
            } else {
                return `I couldn't find information about crops to plant after "${potentialCropNames[0]}" in my database.`;
            }
        }
    
        // Find crops that match the user's query
        const matchedCrops = crops.filter(crop =>
            words.some(word => findBestMatch(word, [crop.crop_name.toLowerCase()]) !== null)
        );
    
        if (matchedCrops.length === 0) {
            return "I'm sorry, I couldn't find information about those crops in my database.";
        }
    
        const nutrientKeywords = {
            n: ['nitrogen', 'n', 'nitrate'],
            p: ['phosphorus', 'p', 'phosphate'],
            k: ['potassium', 'k', 'potash']
        };
    
        const askedNutrients = Object.entries(nutrientKeywords)
            .filter(([_, keywords]) => keywords.some(keyword => 
                words.some(word => findBestMatch(word, [keyword]) !== null)
            ))
            .map(([key]) => key);
    
        if (words.some(word => 
            findBestMatch(word, ['npk', 'nutrient', 'fertilizer']) !== null
        )) {
            askedNutrients.push('n', 'p', 'k');
        }
    
        if (askedNutrients.length > 0) {
            return matchedCrops.map(crop => {
                const nutrients = askedNutrients.map(nutrient => {
                    switch (nutrient) {
                        case 'n': return `nitrogen: ${crop.recommended_nitrogen}`;
                        case 'p': return `phosphorus: ${crop.recommended_phosphorus}`;
                        case 'k': return `potassium: ${crop.recommended_potassium}`;
                        default: return '';
                    }
                }).join(', ');
                return `For ${crop.crop_name}, the recommended ${askedNutrients.length > 1 ? 'nutrients are' : 'nutrient is'} ${nutrients}.`;
            }).join(' ');
        } else if (words.some(word => 
            findBestMatch(word, ['rotatable', 'rotation', 'alternate', 'sequence', 'plant after']) !== null
        )) {
            return matchedCrops.map(crop => 
                crop.rotatable_with && crop.rotatable_with.length > 0 
                    ? `${crop.crop_name} can be rotated with ${crop.rotatable_with.join(', ')}.`
                    : `I don't have rotation information for ${crop.crop_name}.`
            ).join(' ');
        } else {
            return "I'm not sure what specific information you're looking for. You can ask about nutrients (like nitrogen, phosphorus, potassium) or crop rotation.";
        }
    };
    // const fetchDatabaseResponse = async (userMessage: string): Promise<void> => {
    //     setIsLoading(true);
    
    //     try {
    //         setMessages(prev => [...prev, { role: 'assistant', content: '', isComplete: false }]);
    
    //         const keywords = userMessage.toLowerCase().split(' ').filter(word => word.length > 3);
    //         console.log('Extracted keywords:', keywords);
    
    //         const relevantCrops = await queryDatabase(keywords);
    //         console.log('Server query results:', relevantCrops);
    
    //         const response = generateDatabaseResponse(relevantCrops, userMessage);
    //         console.log('Generated response:', response);
    
    //         setMessages(prev => {
    //             const updatedMessages = [...prev];
    //             const lastMessage = updatedMessages[updatedMessages.length - 1];
    //             if (lastMessage.role === 'assistant') {
    //                 lastMessage.content = response;
    //                 lastMessage.isComplete = true;
    //             }
    //             return updatedMessages;
    //         });
    //     } catch (error) {
    //         console.error('Error fetching response:', error);
    //         toast({
    //             title: 'Error',
    //             description: 'Failed to get response from the server.',
    //             status: 'error',
    //             duration: 3000,
    //             isClosable: true,
    //         });
    //         setMessages(prev => [
    //             ...prev,
    //             { role: 'assistant', content: 'Sorry, I encountered an error while querying the server.', isComplete: true }
    //         ]);
    //     } finally {
    //         setIsLoading(false);
    //     }
    
    // };
    // const handleSend = async () => {
    //     if (input.trim() === '') return;

    //     const userMessage: Message = { role: 'user', content: input, isComplete: true };
    //     setMessages(prev => [...prev, userMessage]);
    //     setInput('');

    //     // await fetchHuggingFaceResponse(input);
    //     await fetchDatabaseResponse(input);
    // };


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
            console.log("voices" + voices)
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
                        <Button colorScheme="blue" onClick={handleSend} isLoading={isLoading} loadingText="Sending">
                            Send 
                        </Button>
                        {/* onClick={handleSend}  */}
                    </Flex>
                </GridItem>
            </Grid>
        </Flex>
    );
};

export default Chatbot;