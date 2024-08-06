import React from 'react';
import styled from 'styled-components';
import { Box, Grid, GridItem, Flex } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';


const Home: React.FC = () => {
    const navigate = useNavigate();

    const toAdvisorBot = () => {
        navigate('/chatbot');
    };
    const toIPM = () => {
        navigate('/ipm');
    };
    const toCalculator = () => {
        navigate('/calculator');
    };
    const toForum = () => {
        navigate('/forum');
    };
    return (
        <div>
            {/* <Navbar /> */}
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                // height="100vh"
                margin="10px"
            >
                <Container>
                    <Features>
                        <FeatureRow>
                            <Feature onClick={toAdvisorBot}>
                                < Flex direction="column" style={{ display: 'flex', justifyContent: 'center' }}>
                                    <img src="/icons/bot.svg" style={{ maxHeight: '100px' }} />
                                    <FeatureTitle>Advisor Bot</FeatureTitle>
                                    <FeatureDescription>Solve your challenges and concerns instantly!
                                    </FeatureDescription>
                                </Flex>
                            </Feature>
                            <Feature onClick={toForum}>
                                < Flex direction="column" style={{ display: 'flex', justifyContent: 'center' }}>
                                    <img src="/icons/group.svg" style={{ maxHeight: '100px' }} />
                                    <FeatureTitle>Ask others</FeatureTitle>
                                    <FeatureDescription>Reach out to other farmers and professionals for advice!
                                    </FeatureDescription>
                                </Flex>
                            </Feature>
                        </FeatureRow>
                        <FeatureRow>
                            <Feature onClick={toCalculator}>
                                < Flex direction="column" style={{ display: 'flex', justifyContent: 'center' }}>
                                    <img src="/icons/calculator.svg" style={{ maxHeight: '100px' }} />
                                    <FeatureTitle>Calculator</FeatureTitle>
                                    <FeatureDescription>Save your cost with precise calculationsof farming inputs</FeatureDescription>
                                </Flex>
                            </Feature>
                            <Feature onClick={toIPM}>
                                < Flex direction="column" style={{ display: 'flex', justifyContent: 'center' }}>
                                    <img src="/icons/pest.svg" style={{ maxHeight: '100px' }} />
                                    <FeatureTitle>Integrated Pest Management</FeatureTitle>
                                    <FeatureDescription>Receive actionable recommendations specific tailored to your crops</FeatureDescription>
                                </Flex>
                            </Feature>
                        </FeatureRow>
                    </Features>
                </Container>
            </Box>
        </div>

    );
}
const Container = styled.div`
  font-family: 'Arial', sans-serif;
  color: #333;
`;
const Features = styled.div`
  padding: 4rem 2rem;
  background-color: #f8f8f8;
`;

const FeatureRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Feature = styled.div`
  text-align: center;
  padding: 1.5rem;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 48%; // Adjust this value to control the gap between features
   &:hover {
    transform: scale(1.05); // Enlarge the element slightly
  }
`;

// const FeatureIcon = styled.img`
//   width: 64px;  // Adjust size as needed
//   height: 64px;
//   margin-bottom: 1rem;
// `;

const FeatureTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #2c7744;
`;

const FeatureDescription = styled.p`
  font-size: 0.9rem;
`;
export default Home;
