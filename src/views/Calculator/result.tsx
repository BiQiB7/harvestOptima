import React from 'react'
import { Flex, Box, Text, VStack } from '@chakra-ui/react';
import { useLocation, Navigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';

interface CalculationResult {
    urea: number;
    tsp: number;
    mop: number;
}
const BackButton = () => {
    const navigate = useNavigate();
    return (
        <button onClick={() => navigate(-1)} type='button' style={{ padding: '10px 20px', background: 'none', border: 'none', borderRadius: '5px', color: '#9441FD', cursor: 'pointer', marginBottom: '20px', }}>
            Back
        </button>
    );
};
const CalculatorResult: React.FC = () => {
    const location = useLocation();
    const result = location.state?.result as CalculationResult | undefined;

    if (!result) {
        return <Navigate to="/calculator" replace />;
    }

    // Calculate number of bags
    const ureaBags = Math.ceil(result.urea / 20); // 20kg per bag
    const tspBags = Math.ceil(result.tsp / 50);   // 50kg per bag
    const mopBags = Math.ceil(result.mop / 25);   // 25kg per bag

    return (
        <Flex direction='column' minHeight="100vh">
            <Navbar />
            <BackButton />
            <Flex flex={1} justifyContent="center" alignItems="center" margin="20px">
                <VStack spacing={6} align="stretch" maxW='1000px' width="100%">
                    <Text fontSize="2xl" fontWeight="bold">Required Fertilisers</Text>

                    <Flex direction="row" gap={8} justifyContent='center' bg="#004E36" color="#FFFFFF" p={6} borderRadius="md">
                        <Box>
                            <Text fontWeight="bold">Urea</Text>
                            <Text>{result.urea.toFixed(2)} kg</Text>
                        </Box>
                        <Box>
                            <Text fontWeight="bold">TSP</Text>
                            <Text>{result.tsp.toFixed(2)} kg</Text>
                        </Box>
                        <Box>
                            <Text fontWeight="bold">MOP</Text>
                            <Text>{result.mop.toFixed(2)} kg</Text>
                        </Box>
                    </Flex>
                    <Flex direction="row" gap={8} justifyContent='center' p={6} borderRadius="md">
                        <Box
                            alignItems="center"
                            justifyContent="center"
                            bg="white"
                            boxShadow="md"
                            p={4}
                            borderRadius="md"
                        >
                            <Text style={{ color: "#000000" }}>{ureaBags} x </Text>
                            <img src="/images/urea.svg" alt="urea" style={{ width: "100%", height: "150px", borderRadius: "10px", objectFit: "cover", objectPosition: "center" }} />
                            <Flex direction='column'>
                                <a
                                    style={{
                                        color: '#0303fc',
                                        textDecoration: 'underline',
                                        fontStyle: 'italic',
                                        marginLeft: '8px' // Add some space between the text and link
                                    }}
                                    href="https://www.google.com/shopping/product/1?q=urea+fertilizer+package&prds=epd:2307553728058620213,eto:2307553728058620213_0,pid:2307553728058620213&sa=X&ved=0ahUKEwjT9afHmd6HAxXBTWwGHUe6FkQQ9pwGCAw"
                                >
                                    Visit Product
                                </a>
                                <a
                                    style={{
                                        color: '#0303fc',
                                        textDecoration: 'underline',
                                        fontStyle: 'italic',
                                        marginLeft: '8px' // Add some space between the text and link
                                    }}
                                    href="https://www.google.com/search?q=urea+fertilizer&sca_esv=981a0d32bcbf9b3f&rlz=1C1CHBD_enMY906MY906&biw=1229&bih=556&tbm=shop&sxsrf=ADLYWILOSaMT_DNeIOawqI1miDBQncFI6g%3A1722872976542&ei=kPSwZom9INW74-EPndmJ6Ac&ved=0ahUKEwiJxYn-md6HAxXV3TgGHZ1sAn0Q4dUDCAg&uact=5&oq=urea+fertilizer&gs_lp=Egtwcm9kdWN0cy1jYyIPdXJlYSBmZXJ0aWxpemVyMgQQIxgnMgUQABiABDIFEAAYgAQyBRAAGIAEMgUQABiABDIFEAAYgAQyBRAAGIAEMgUQABiABDIFEAAYgAQyBRAAGIAESMIFUI4DWIkEcAB4AJABAJgB6wKgAdYIqgEHMi4wLjEuMrgBA8gBAPgBAZgCBaAC6giYAwCIBgGSBwcyLjAuMS4yoAfFEg&sclient=products-cc"
                                >
                                    See Alternative
                                </a>

                            </Flex>

                        </Box>
                        <Box
                            alignItems="center"
                            justifyContent="center"
                            bg="white"
                            boxShadow="md"
                            p={4}
                            borderRadius="md"
                        >
                            <Text style={{ color: "#000000" }}>{tspBags} x </Text>
                            <img src="/images/tsp.svg" alt="tsp" style={{ width: "100%", height: "150px", borderRadius: "10px", objectFit: "cover", objectPosition: "center" }} />
                            <Flex direction='column'>
                                <a
                                    style={{
                                        color: '#0303fc',
                                        textDecoration: 'underline',
                                        fontStyle: 'italic',
                                        marginLeft: '8px' // Add some space between the text and link
                                    }}
                                    href="https://www.google.com/shopping/product/1?q=tsp+fertilizer&prds=epd:11490804110791746228,eto:11490804110791746228_0,pid:11490804110791746228&sa=X&ved=0ahUKEwiu1Lu7mt6HAxVxXGwGHcAPBdgQ9pwGCAs"
                                >
                                    Visit Product
                                </a>
                                <a
                                    style={{
                                        color: '#0303fc',
                                        textDecoration: 'underline',
                                        fontStyle: 'italic',
                                        marginLeft: '8px' // Add some space between the text and link
                                    }}
                                    href="https://www.google.com/search?q=tsp+fertilizer&sca_esv=981a0d32bcbf9b3f&rlz=1C1CHBD_enMY906MY906&biw=1229&bih=556&tbm=shop&sxsrf=ADLYWILZeBzuDzWb8whgws-2UwVVvJ5O-Q%3A1722873102681&ei=DvWwZpGDKcmXnesP6oH4uAU&ved=0ahUKEwiRwpy6mt6HAxXJS2cHHeoAHlcQ4dUDCAg&uact=5&oq=tsp+fertilizer&gs_lp=Egtwcm9kdWN0cy1jYyIOdHNwIGZlcnRpbGl6ZXIyBBAjGCcyBRAAGIAESM4DUABYAHAAeACQAQCYAWCgAWCqAQExuAEDyAEAmAIBoAJomAMAiAYBkgcDMC4xoAeVAg&sclient=products-cc"
                                >
                                    See Alternative
                                </a>

                            </Flex>
                        </Box>
                        <Box
                            alignItems="center"
                            justifyContent="center"
                            bg="white"
                            boxShadow="md"
                            p={4}
                            borderRadius="md"
                        >
                            <Text style={{ color: "#000000" }}>{mopBags} x </Text>
                            <img src="/images/mop.svg" alt="mop" style={{ width: "100%", height: "150px", borderRadius: "10px", objectFit: "cover", objectPosition: "center" }} />
                            <Flex direction='column'>
                                <a
                                    style={{
                                        color: '#0303fc',
                                        textDecoration: 'underline',
                                        fontStyle: 'italic',
                                        marginLeft: '8px' // Add some space between the text and link
                                    }}
                                    href="https://www.google.com/shopping/product/1?q=muriate+of+potash+terralink&prds=epd:12557283244039107580,eto:12557283244039107580_0,pid:12557283244039107580&sa=X&ved=0ahUKEwj8r6eHm96HAxUrU2wGHTeUOBMQ9pwGCAk"
                                >
                                    Visit Product
                                </a>
                                <a
                                    style={{
                                        color: '#0303fc',
                                        textDecoration: 'underline',
                                        fontStyle: 'italic',
                                        marginLeft: '8px' // Add some space between the text and link
                                    }}
                                    href="https://www.google.com/search?q=muriate+of+potash&sca_esv=981a0d32bcbf9b3f&rlz=1C1CHBD_enMY906MY906&biw=1229&bih=556&tbm=shop&sxsrf=ADLYWILoa3bpiHKOIQ5zgWmF_7VQ-kjkxQ%3A1722873258221&ei=qvWwZp31DIeRnesPkb2miAo&ved=0ahUKEwid8rGEm96HAxWHSGcHHZGeCaEQ4dUDCAg&uact=5&oq=muriate+of+potash&gs_lp=Egtwcm9kdWN0cy1jYyIRbXVyaWF0ZSBvZiBwb3Rhc2gyBBAjGCcyBBAjGCcyBRAAGIAEMgUQABiABDIFEAAYgAQyBRAAGIAEMgUQABiABDIGEAAYFhgeSO0PUPQLWOIMcAF4AJABAJgBO6ABowGqAQEzuAEDyAEA-AEBmAIEoAKvAZgDAIgGAZIHATSgB5gP&sclient=products-cc"
                                >
                                    See Alternative
                                </a>

                            </Flex>
                        </Box>
                    </Flex>
                </VStack>
            </Flex>
        </Flex>
    )
}

export default CalculatorResult;