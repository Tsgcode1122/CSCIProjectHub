import React from "react";
import styled from "styled-components";
import SectionDiv from "../fixedComponent/SectionDiv";
import HeroCountdown from "./HeroCountdown";
import { Colors } from "../theme/Colors";
import ETSUButton from "../fixedComponent/ETSUButton";
import { breakpoints, media } from "../theme/Breakpoints";
const Hero = () => {
  return (
    <SectionDiv>
      <HeroText>
        <Title>Showcasing Research & Innovation</Title>
        <Underline />

        <Description>
          Explore student and faculty projects and thesis work across Computer
          Science, Information Technology, Information Systems, and
          Cybersecurity, highlighting research, innovation, and academic
          excellence.
        </Description>
      </HeroText>
      <CTAWrap>
        <ETSUButton text="View Projects" to="/projects" />
        <ETSUButton text="Explore Theses" to="/theses" />
      </CTAWrap>
    </SectionDiv>
  );
};

export default Hero;

// Styling
const HeroText = styled.div`
  text-align: center;
  margin: 0 auto;
  max-width: 1100px;
  padding-top: 1.5rem;
  padding-bottom: 2rem;
  @media ${media.tablet} {
    padding-top: 4.5rem;
  }
`;

const Title = styled.h1`
  margin: 0;
  color: ${Colors.brightBlue};
  font-weight: 500;
  letter-spacing: 0.02em;
`;

const Underline = styled.div`
  width: 150px;
  height: 6px;
  border-radius: 999px;
  background: #f2b705;
  margin: 1.1rem auto 1.6rem auto;
`;

const Description = styled.p`
  margin: 0 auto;
  max-width: 980px;
  color: ${Colors.lightBlack};
  /* font-weight: 500; */
`;
const CTAWrap = styled.div`
  display: flex;
  gap: 1rem;

  justify-content: center;
  flex-wrap: wrap;
  @media ${media.tablet} {
    gap: 2rem;
  }
`;
