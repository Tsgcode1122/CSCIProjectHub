import React from "react";
import styled from "styled-components";
import SectionDiv from "../fixedComponent/SectionDiv";
import SectionHeader from "../fixedComponent/SectionHeader";
import ETSUButton from "../fixedComponent/ETSUButton";

const FeaturedThesis = () => {
  return (
    <SectionDiv>
      <Wrapper>
        <SectionHeader
          title="Featured Thesis Research"
          subtitle="Explore ongoing and completed thesis research across various departments."
        />

        {/* Placeholder for featured thesis slider */}
        <SliderContainer>
          {/* Featured thesis cards / slider will go here */}
        </SliderContainer>

        {/* Centered CTA */}
        <ButtonWrap>
          <ETSUButton text="View All Theses" to="/theses" />
        </ButtonWrap>
      </Wrapper>
    </SectionDiv>
  );
};

export default FeaturedThesis;
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
