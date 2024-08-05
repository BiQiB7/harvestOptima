import React from 'react';
import { Box, Grid, GridItem, Flex } from "@chakra-ui/react";
import Card from '../../components/Card';
import Navbar from '../../components/Navbar';

const Home: React.FC = () => {
    return (
        <div>
            <Navbar />
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                height="100vh"
                margin="10px"
            >

                <Grid templateColumns="repeat(2, 1fr)" gap={4} width='100%'>
                    <GridItem>
                        <Card>
                            <img src="/images/chatbot-green.png" alt="chatbot-icon" style={{ width: "30vw", borderRadius: "10px", objectFit: "cover", objectPosition: "center" }} />
                            <p>Chatbot</p>
                        </Card>
                    </GridItem>
                    <GridItem>
                        <Box w="100%" h="100px" bg="green.500">
                            Box 2
                        </Box>
                    </GridItem>
                    <GridItem>
                        <Box w="100%" h="100px" bg="red.500">
                            Box 3
                        </Box>
                    </GridItem>
                    <GridItem>
                        <Box w="100%" h="100px" bg="purple.500">
                            Box 4
                        </Box>
                    </GridItem>
                </Grid>
            </Box>
        </div>
    );
}
export default Home;
