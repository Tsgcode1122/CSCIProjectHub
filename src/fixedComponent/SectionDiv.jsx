import React from "react";
import styled from "styled-components";
import { breakpoints, media } from "../theme/Breakpoints";

// ================== Section Container ==================
const SectionContainer = styled.div`
  /* Default padding for medium screens */
  padding: 2rem 1.5rem;
  margin: 0 auto;

  /* Extra small screens (e.g., iPhone 6, 320px) */
  @media ${media.mobileXS} {
    padding: 2rem 0.8rem;
  }

  /* Small phones (480px and below) */
  @media ${media.mobileS} {
    padding: 2rem 1rem;
  }

  /* Medium phones (576px and below) */
  @media ${media.mobileM} {
    padding: 2rem 1.5rem;
  }

  /* Large phones (679px and below) */
  @media ${media.mobileL} {
    padding: 2rem 2rem;
  }

  /* Tablets (768px and below) */
  @media ${media.tablet} {
    padding: 2rem 2rem;
  }

  /* Small laptops (1024px and below) */
  @media ${media.laptop} {
    max-width: 1150px;
    padding: 2rem 4rem;
  }

  /* Desktops (1440px and below) */
  @media ${media.desktop} {
    max-width: 1400px;
    padding: 2rem 0rem;
  }

  /* Extra large desktops / 4K screens (1920px) */
  @media ${media.desktopXL} {
    max-width: 1600px;
    padding: 2rem 0rem;
  }
`;

// ================== SectionDiv Component ==================
const SectionDiv = ({ children }) => {
  return <SectionContainer>{children}</SectionContainer>;
};

export default SectionDiv;
