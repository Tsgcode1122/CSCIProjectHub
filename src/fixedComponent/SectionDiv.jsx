import React from "react";
import styled from "styled-components";
import { media } from "../theme/Breakpoints";

const SectionContainer = styled.div`
  padding: 2rem 1.5rem 0.7rem 1.5rem;
  margin: 0 auto;

  @media ${media.mobileXS} {
    padding: 1.3rem 0.8rem;
  }

  @media ${media.mobileS} {
    padding: 1.5rem 1rem;
  }

  @media ${media.mobileM} {
    padding: 2rem 1.5rem;
  }

  @media ${media.mobileL} {
    padding: 2rem 3rem;
  }

  @media ${media.tablet} {
    padding: 2rem 4rem;
  }

  @media ${media.laptop} {
    max-width: 1200px;
    padding: 2rem 4rem;
  }

  @media ${media.desktop} {
    max-width: 1200px;
    padding: 2rem 6rem;
  }

  @media ${media.desktopXL} {
    max-width: 1600px;
    padding: 2rem 8rem;
  }
`;

const SectionDiv = ({ children }) => {
  return <SectionContainer>{children}</SectionContainer>;
};

export default SectionDiv;
