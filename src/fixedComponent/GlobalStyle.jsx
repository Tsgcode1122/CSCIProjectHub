import { createGlobalStyle } from "styled-components";
import { media } from "../theme/Breakpoints";
import { Colors } from "../theme/Colors";

const GlobalStyle = createGlobalStyle`
  html,
  body {
    scrollbar-gutter: auto !important;
  }
    
  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: "Inter", sans-serif;
    font-optical-sizing: auto;
    background: ${Colors.softBlue};
    margin: 0;
    padding: 0;
    color: #0f172a;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  * {
    box-sizing: border-box;
  }

  h1, h2, h3, h4, h5, p, small {
    margin-top: 0;
  }

  h1 {
   font-size: 2.25rem; 
    line-height: 1.1;
    font-weight: 800;
    letter-spacing: -0.02em;

    @media ${media.mobileS} {
      font-size: 2.2rem;
      line-height: 2.6rem;
    }

    @media ${media.tablet} {
      font-size: 2.8rem; 
      line-height: 1.15;
    }

    @media ${media.laptop} {
      font-size: 3.2rem;
      line-height: 3.4rem;
    }

    @media ${media.desktopXL} {
    font-size: 4rem;
      line-height: 3.6rem;
    }
  }

  h2 {
    font-size: 1.6rem;
    line-height: 2rem;
    font-weight: 800;
    letter-spacing: -0.02em;

    @media ${media.mobileS} {
      font-size: 1.8rem;
      line-height: 2.2rem;
    }

    @media ${media.tablet} {
      font-size: 2.1rem;
      line-height: 2.5rem;
    }

    @media ${media.laptop} {
      font-size: 2.4rem;
      line-height: 2.8rem;
    }

    @media ${media.desktopXL} {
      font-size: 2.6rem;
      line-height: 3rem;
    }
  }

  h3 {
    font-size: 1.35rem;
    line-height: 1.8rem;
    font-weight: 700;
    letter-spacing: -0.01em;

    @media ${media.mobileS} {
      font-size: 1.5rem;
      line-height: 2rem;
    }

    @media ${media.tablet} {
      font-size: 1.75rem;
      line-height: 2.2rem;
    }

    @media ${media.laptop} {
      font-size: 2rem;
      line-height: 2.5rem;
    }

    @media ${media.desktopXL} {
      font-size: 2.15rem;
      line-height: 2.65rem;
    }
  }

  h4 {
    font-size: 1.2rem;
    line-height: 1.6rem;
    font-weight: 700;

    @media ${media.mobileS} {
      font-size: 1.2rem;
      line-height: 1.7rem;
    }

    @media ${media.tablet} {
      font-size: 1.4rem;
      line-height: 1.9rem;
    }

    @media ${media.laptop} {
      font-size: 1.65rem;
      line-height: 2rem;
    }

    @media ${media.desktopXL} {
      font-size: 1.8rem;
      line-height: 2.2rem;
    }
  }

  h5 {
    font-size: 1rem;
    line-height: 1.4rem;
    font-weight: 700;

    @media ${media.mobileS} {
      font-size: 1.05rem;
      line-height: 1.45rem;
    }

    @media ${media.tablet} {
      font-size: 1.1rem;
      line-height: 1.5rem;
    }

    @media ${media.laptop} {
      font-size: 1.2rem;
      line-height: 1.6rem;
    }

    @media ${media.desktopXL} {
      font-size: 1.3rem;
      line-height: 1.75rem;
    }
  }

  p {
    font-size: 1rem;
    line-height: 1.7rem;
    font-weight: 400;
    color: white;

    @media ${media.mobileS} {
      font-size: 1.02rem;
      line-height: 1.75rem;
    }

    @media ${media.tablet} {
      font-size: 1.05rem;
      line-height: 1.8rem;
    }

    @media ${media.laptop} {
      font-size: 1.1rem;
      line-height: 1.8rem;
    }

    @media ${media.desktopXL} {
      font-size: 1.2rem;
      line-height: 1.9rem;
    }
  }
ul{
 
    font-size: 1rem;
    line-height: 1.7rem;
    font-weight: 400;
    color: white;

    @media ${media.mobileS} {
      font-size: 1.02rem;
      line-height: 1.75rem;
    }

    @media ${media.tablet} {
      font-size: 1.05rem;
      line-height: 1.8rem;
    }

    @media ${media.laptop} {
      font-size: 1.1rem;
      line-height: 1.8rem;
    }

    @media ${media.desktopXL} {
      font-size: 1.2rem;
      line-height: 1.9rem;
    }
  
}
  small {
    font-size: 0.8rem;
    line-height: 1.2rem;
    color: #64748b;

    @media ${media.laptop} {
      font-size: 0.95rem;
      line-height: 1.3rem;
    }

    @media ${media.desktopXL} {
      font-size: 1.05rem;
      line-height: 1.4rem;
    }
  }
`;

export default GlobalStyle;
