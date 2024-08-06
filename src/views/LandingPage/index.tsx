import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/home');
    };
    return (
        <div style={{display: 'flex', justifyContent: 'center'}}>
            <Container> 
            <Header>
                <Logo>HarvestOptima</Logo>
            </Header>

            <Hero>
                <HeroContent>
                    <HeroTitle>Reliable, Real-Time Farming Advisor and Precision Tool</HeroTitle>
                    <HeroSubtitle>Maximize your yield with professional, verified knowledge at your fingertips</HeroSubtitle>
                    <CTAButton onClick={handleClick}>Get Started</CTAButton>
                </HeroContent>
            </Hero>

            <Features>
                <Feature>
                    <FeatureIcon>🌱</FeatureIcon>
                    <FeatureTitle>Real-Time Solutions</FeatureTitle>
                    <FeatureDescription>Get instant advice based on current conditions and verified knowledge.</FeatureDescription>
                </Feature>
                <Feature>
                    <FeatureIcon>🔬</FeatureIcon>
                    <FeatureTitle>Professional Expertise</FeatureTitle>
                    <FeatureDescription>Access a comprehensive, verified knowledge base curated by agricultural experts.</FeatureDescription>
                </Feature>
                <Feature>
                    <FeatureIcon>🗺️</FeatureIcon>
                    <FeatureTitle>Easy Navigation</FeatureTitle>
                    <FeatureDescription>Intuitive interface designed for farmers of all tech levels.</FeatureDescription>
                </Feature>
                <Feature>
                    <FeatureIcon>🎯</FeatureIcon>
                    <FeatureTitle>Personalized Advice</FeatureTitle>
                    <FeatureDescription>Receive actionable recommendations tailored to your specific crop and conditions.</FeatureDescription>
                </Feature>
                <Feature>
                    <FeatureIcon>🛰️</FeatureIcon>
                    <FeatureTitle>Satellite-Powered</FeatureTitle>
                    <FeatureDescription>Utilize advanced satellite technology for precise crop detection.</FeatureDescription>
                </Feature>
                <Feature>
                    <FeatureIcon>🧮</FeatureIcon>
                    <FeatureTitle>Precision farming</FeatureTitle>
                    <FeatureDescription>POptimize your farming input use with our calculators.</FeatureDescription>
                </Feature>
            </Features>

            {/* <Footer>
                <FooterText>&copy; 2024 HarvestOptima. All rights reserved.</FooterText>
            </Footer> */}
            </Container>
        </div>
    );
};

const Container = styled.div`
  font-family: 'Arial', sans-serif;
  color: #333;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #f8f8f8;
`;

const Logo = styled.h1`
  font-size: 1.5rem;
  color: #2c7744;
`;

const Nav = styled.nav`
  display: flex;
`;

const NavItem = styled.a`
  margin-left: 1rem;
  text-decoration: none;
  color: #2c7744;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Hero = styled.div`
  background-image: url('/images/background.svg');
  background-size: cover;
  background-position: center;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HeroContent = styled.div`
  text-align: center;
  color: white;
  padding: 2rem;
  border-radius: 10px;
`;

const HeroTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
`;

const CTAButton = styled.button`
  background-color: #2c7744;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #1e5530;
  }
`;

const Features = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  padding: 4rem 2rem;
  background-color: #f8f8f8;
`;

const Feature = styled.div`
  text-align: center;
  padding: 1.5rem;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #2c7744;
`;

const FeatureDescription = styled.p`
  font-size: 0.9rem;
`;

const Footer = styled.footer`
  background-color: #2c7744;
  color: white;
  text-align: center;
  padding: 1rem;
`;

const FooterText = styled.p`
  margin: 0;
`;

export default LandingPage;