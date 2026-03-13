import React from "react";
import styled from "styled-components";

import BackButton from "./BackButton";
import SectionDiv from "./SectionDiv";
import { media } from "../theme/Breakpoints";
import { Colors } from "../theme/Colors";

const PageHeader = ({ title, subtitle, backLabel = "Back" }) => {
  return (
    <HeaderWrap>
      <SectionDiv>
        <HeaderInner>
          {/* Render BackButton if a label is passed. Set to false/null to hide it. */}
          {backLabel && <BackButton label={backLabel} />}
          <HeaderText>
            <HeaderTitle>{title}</HeaderTitle>
            {subtitle && <HeaderSubtitle>{subtitle}</HeaderSubtitle>}
          </HeaderText>
        </HeaderInner>
      </SectionDiv>
    </HeaderWrap>
  );
};

export default PageHeader;

// ---------------- styles ----------------

const HeaderWrap = styled.div`
  background: ${Colors.brightBlue};
  position: relative;
`;

const HeaderInner = styled.div`
  display: grid;
  gap: 1.2rem;
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  @media ${media.tablet} {
    gap: 1.4rem;
  }
`;

const HeaderText = styled.div``;

const HeaderTitle = styled.h2`
  margin: 0;
  color: ${Colors.white};
  font-weight: 600;
`;

const HeaderSubtitle = styled.p`
  margin: 0.6rem 0 0 0;
  color: rgba(255, 255, 255, 0.85);
  max-width: 900px;
`;
