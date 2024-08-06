import React, { useState } from 'react'
import { Box, Grid, GridItem, Flex, Textarea, Button, Select } from "@chakra-ui/react";
import Navbar from '../../components/Navbar'
import { useNavigate } from 'react-router-dom';

const Calculator: React.FC = () => {
    const [currentN, setCurrentN] = useState<string>('0');
    const [currentP, setCurrentP] = useState<string>('0');
    const [currentK, setCurrentK] = useState<string>('0');
    const [area, setArea] = useState<string>('0');
    const [cropType, setCropType] = useState<string>('Mung Bean');
    const navigate = useNavigate();

    const recommendedNPK = {
        'Mung Bean': { N: 1, P: 0.5, K: 1.59 },
        'Millet': { N: 40, P: 20, K: 20 }
    };

    const handleNumberInput = (setter: React.Dispatch<React.SetStateAction<string>>) => (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        const value = e.target.value;
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setter(value);
        }
    };

    const calculateFertilizer = () => {
        const recommended = recommendedNPK[cropType as keyof typeof recommendedNPK];

        // Parse the string inputs to numbers
        const parsedCurrentN = parseFloat(currentN) || 0;
        const parsedCurrentP = parseFloat(currentP) || 0;
        const parsedCurrentK = parseFloat(currentK) || 0;
        const parsedArea = parseFloat(area) || 0;

        // Calculate the difference in NPK ratios
        const diffN = Math.max(0, recommended.N - parsedCurrentN);
        const diffP = Math.max(0, recommended.P - parsedCurrentP);
        const diffK = Math.max(0, recommended.K - parsedCurrentK);

        // Constants for nutrient content in fertilizers
        const UREA_N_CONTENT = 0.46; // 46% N in urea
        const TSP_P_CONTENT = 0.46; // 46% P2O5 in TSP
        const MOP_K_CONTENT = 0.60; // 60% K2O in Muriate of Potash

        // Calculate required fertilizer amounts in kg
        const urea = (diffN * parsedArea*100) / UREA_N_CONTENT;
        const tsp = (diffP * parsedArea*100) / TSP_P_CONTENT;
        const mop = (diffK * parsedArea*100) / MOP_K_CONTENT;

        // Round the results to two decimal places
        const result = {
            urea: Math.max(0, Math.round(urea) / 100),
            tsp: Math.max(0, Math.round(tsp) / 100),
            mop: Math.max(0, Math.round(mop) / 100)
        };

        navigate('/calculator/result', { state: { result } });
    };

    return (
        <Flex direction='column' minHeight="100vh">
            <Navbar />
            <Flex flex={1} justifyContent="center" alignItems="center" margin="20px">
                <Flex direction="column" maxW='1000px' alignItems='flex-start'>
                <Flex direction="row">
                        <p style={{ width: '100%' }}>Crop type</p>
                        <Select width='300px' value={cropType} onChange={(e) => setCropType(e.target.value)}>
                            <option value='Mung Bean'>Mung Bean</option>
                            <option value='Millet'>Millet</option>
                        </Select>
                    </Flex>

                    <h1 style={{ marginTop: '20px' }}>Current Nutrient Level (%)</h1>

                    <Flex direction="row" alignItems="center">
                        <p>Purchase soil NPK test kit</p>
                        <a
                            style={{
                                color: '#0303fc',
                                textDecoration: 'underline',
                                fontStyle: 'italic',
                                marginLeft: '8px' // Add some space between the text and link
                            }}
                            href="https://www.google.com/search?sca_esv=ce2bee5ef594bfe7&sxsrf=ADLYWIJVnkAqA2VG5XGORM4nqePxK_mnQQ:1722867326512&q=soil+npk+test+kit&tbm=shop&source=lnms&fbs=AEQNm0CvspUPonaF8UH5s_LBD3JPX4RSeMPt9v8oIaeGMh2T2D1DyqhnuPxLgMgOaYPYX7OtOF4SxbM4YPsyWUMdeXRPnkQc3caC_NEMjyGZlBqX7YDVSc-lk14rE2h7j-ln6ORWjT4WxqVC6FS82YpEwEqqnkJJKpHqKGrk5ZhbNsOcE3i19GRoFANVfwr_gZS3oWcL17KMyupN4i8_p5OTUvqC1CSN_g&ved=1t:200715&ictx=111&biw=1229&bih=556&dpr=1.56"
                        >
                            Here
                        </a>
                    </Flex>

                    <Flex direction="row" alignItems="center">
                        <p>Watch to guide soil test</p>
                        <a
                            style={{
                                color: '#0303fc',
                                textDecoration: 'underline',
                                fontStyle: 'italic',
                                marginLeft: '8px' // Add some space between the text and link
                            }}
                            href="https://www.youtube.com/watch?v=o78MB7R4EbE"
                        >
                            Here
                        </a>
                    </Flex>
                    <Grid templateColumns="repeat(3, 1fr)" gap={4} width='100%' margin='30px'>
                        <GridItem>Nitrogen (N):</GridItem>
                        <GridItem>Phosphorus (P):</GridItem>
                        <GridItem>Potassium (K):</GridItem>
                        <GridItem>
                            <Textarea value={currentN} onChange={handleNumberInput(setCurrentN)} />
                        </GridItem>
                        <GridItem>
                            <Textarea value={currentP} onChange={handleNumberInput(setCurrentP)} />
                        </GridItem>
                        <GridItem>
                            <Textarea value={currentK} onChange={handleNumberInput(setCurrentK)} />
                        </GridItem>
                    </Grid>
                    <Flex direction="row" alignItems="center" width="100%" marginBottom="20px">
                        <p style={{ marginRight: '10px' }}>Land Area (meter square):</p>
                        <Textarea value={area} onChange={handleNumberInput(setArea)} width="200px" />
                    </Flex>
                    <Button style={{ backgroundColor: '#004E36', color: '#FFFFFF', width: '100%' }} onClick={calculateFertilizer}>Calculate</Button>
                </Flex>
            </Flex>
        </Flex>
    );
}

export default Calculator;