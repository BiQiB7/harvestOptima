import React from 'react';
import styled from 'styled-components';
import { Box, Grid, GridItem, Flex } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
    const navigate = useNavigate();

    const toAdvisorBot = () => navigate('/chatbot');
    const toIPM = () => navigate('/ipm');
    const toCalculator = () => navigate('/calculator');
    const toForum = () => navigate('/forum');

    const features = [
        { title: "Advisor Bot", description: "Solve your challenges and concerns instantly", icon: "/icons/bot.svg", onClick: toAdvisorBot },
        { title: "Ask others", description: "Reach out to other farmers and professionals for advice", icon: "/icons/group.svg", onClick: toForum },
        { title: "Calculator", description: "Save your cost with precise calculations of farming inputs", icon: "/icons/calculator.svg", onClick: toCalculator },
        { title: "Integrated Pest Management", description: "Receive actionable recommendations specific tailored to your crops", icon: "/icons/pest.svg", onClick: toIPM },
    ];

    return (
        <Flex justifyContent="center" alignItems='center'>
            <Grid
                templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                gap={6}
                justifyContent="center"
                maxW="800px"
                margin="20px" 
                padding="20px"             
            >
                {features.map((feature, index) => (
                    <GridItem key={index}>
                        <Feature onClick={feature.onClick}>
                            <Flex direction="column" alignItems="center">
                                <img src={feature.icon} style={{ maxHeight: '100px' }} alt={feature.title} />
                                <FeatureTitle>{feature.title}</FeatureTitle>
                                <FeatureDescription>{feature.description}</FeatureDescription>
                            </Flex>
                        </Feature>
                    </GridItem>
                ))}
            </Grid>
        </Flex>
    );
}

const Feature = styled(Box)`
  text-align: center;
  padding: 1.5rem;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: 100%;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #2c7744;
`;

const FeatureDescription = styled.p`
  font-size: 0.9rem;
`;

export default Home;