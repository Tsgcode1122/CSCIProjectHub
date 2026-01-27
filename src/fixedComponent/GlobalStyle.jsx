import { createGlobalStyle } from "styled-components";
import { media } from "../theme/Breakpoints";
import { Colors } from "../theme/Colors";

const GlobalStyle = createGlobalStyle`
  body {
font-family: "Inter", sans-serif;
  background: ${Colors.softBlue} ;
    margin: 0;
    padding: 0;
  }

  /* H1 */
  h1 {
    font-size: 1.8rem;
    line-height: 2.2rem;
    @media ${media.mobileXS} { font-size: 1.5rem; line-height: 2rem; }
    @media ${media.mobileS} { font-size: 1.9rem; line-height: 2.4rem; }
    @media ${media.tablet} { font-size: 2.4rem; line-height: 2.8rem; }
    @media ${media.laptop} { font-size: 2.6rem; line-height: 3rem; }
    @media ${media.desktop} { font-size: 3rem; line-height: 3.4rem; }
    @media ${media.desktopXL} { font-size: 3.2rem; line-height: 3.6rem; }
  }

  /* H2 */
  h2 {
    font-size: 1.6rem;
    line-height: 2rem;
    @media ${media.mobileS} { font-size: 1.8rem; line-height: 2.2rem; }
    @media ${media.tablet} { font-size: 2.2rem; line-height: 2.6rem; }
    @media ${media.laptop} { font-size: 2.4rem; line-height: 2.8rem; }
    @media ${media.desktop} { font-size: 2.6rem; line-height: 3rem; }
    @media ${media.desktopXL} { font-size: 2.8rem; line-height: 3.2rem; }
  }

  /* H3 */
  h3 {
    font-size: 1.4rem;
    line-height: 1.8rem;
    @media ${media.mobileS} { font-size: 1.6rem; line-height: 2rem; }
    @media ${media.tablet} { font-size: 2rem; line-height: 2.4rem; }
    @media ${media.laptop} { font-size: 2.2rem; line-height: 2.6rem; }
    @media ${media.desktop} { font-size: 2.4rem; line-height: 2.8rem; }
    @media ${media.desktopXL} { font-size: 2.6rem; line-height: 3rem; }
  }

  /* H4 */
  h4 {
    font-size: 1.2rem;
    line-height: 1.6rem;
    @media ${media.mobileS} { font-size: 1.4rem; line-height: 1.8rem; }
    @media ${media.tablet} { font-size: 1.6rem; line-height: 2rem; }
    @media ${media.laptop} { font-size: 1.8rem; line-height: 2.2rem; }
    @media ${media.desktop} { font-size: 2rem; line-height: 2.4rem; }
    @media ${media.desktopXL} { font-size: 2.2rem; line-height: 2.6rem; }
  }

  /* H5 */
  h5 {
    font-size: 1rem;
    line-height: 1.4rem;
    @media ${media.mobileS} { font-size: 1.2rem; line-height: 1.6rem; }
    @media ${media.tablet} { font-size: 1.4rem; line-height: 1.8rem; }
    @media ${media.laptop} { font-size: 1.6rem; line-height: 2rem; }
    @media ${media.desktop} { font-size: 1.8rem; line-height: 2.2rem; }
    @media ${media.desktopXL} { font-size: 2rem; line-height: 2.4rem; }
  }

  /* Paragraph */
  p {
    /* font-size: 0.875rem; */
    line-height: 1.55rem;
    @media ${media.mobileXS} { font-size: 0.9rem; line-height: 1.5rem; }
    @media ${media.mobileS} { font-size: 1rem; line-height: 1.5rem; }
    @media ${media.tablet} { font-size: 1.125rem; line-height: 1.75rem; }
    @media ${media.laptop} { font-size: 1.25rem; line-height: 1.8rem; }
    @media ${media.desktopXL} { font-size: 1.375rem; line-height: 2rem; }
  }

  /* Small text */
  small {
    font-size: 0.75rem;
    line-height: 1rem;
    @media ${media.laptop} { font-size: 0.875rem; line-height: 1.25rem; }
    @media ${media.desktop} { font-size: 1rem; line-height: 1.5rem; }
  }
`;

export default GlobalStyle;
