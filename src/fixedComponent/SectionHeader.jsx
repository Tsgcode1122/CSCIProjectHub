import React from "react";
import styled from "styled-components";
import { Colors } from "../theme/Colors";

const SectionHeader = ({ title, subtitle }) => {
  // Shared heading treatment for homepage sections.
  return (
    <Wrapper>
      <Title>{title}</Title>
      <Underline />
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
    </Wrapper>
  );
};

export default SectionHeader;
const Wrapper = styled.div`
  text-align: center;
  margin: 0 auto;
`;

const Title = styled.h4`
  margin: 0;
  color: ${Colors.brightBlue};
`;

const Underline = styled.div`
  width: 80px;
  height: 3px;
  background: ${Colors.etsuGold};
  border-radius: 999px;
  margin: 0.7rem auto 0.6rem auto;
`;

const Subtitle = styled.small`
  display: block;
  max-width: 620px;
  margin: 0 auto;
  line-height: 1.3rem;
`;
