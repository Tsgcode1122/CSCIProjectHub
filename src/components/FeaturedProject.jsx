import React from "react";
import styled from "styled-components";
import SectionDiv from "../fixedComponent/SectionDiv";
import SectionHeader from "../fixedComponent/SectionHeader";
import ETSUButton from "../fixedComponent/ETSUButton";

const FeaturedProject = () => {
  return (
    <SectionDiv>
      <Wrapper>
        <SectionHeader
          title="Featured Capstone Projects"
          subtitle="Explore ongoing and completed capstone projects across various departments."
        />

        <SliderContainer></SliderContainer>

        <ButtonWrap>
          <ETSUButton text="View All Projects" to="/projects" />
        </ButtonWrap>
      </Wrapper>
    </SectionDiv>
  );
};

export default FeaturedProject;
const Wrapper = styled.div`
  display: grid;
  gap: 2rem;
`;

const SliderContainer = styled.div`
  width: 100%;
  min-height: 280px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 16px;
`;

const ButtonWrap = styled.div`
  display: flex;
  justify-content: center;
`;
