// src/fixedComponent/Footer.jsx
import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Colors } from "../theme/Colors";
import { media } from "../theme/Breakpoints";
import { FiMapPin, FiPhone, FiMail } from "react-icons/fi";
import SectionDiv from "./SectionDiv";
import etsuLogo from "../images/etsuE.png";
const Footer = () => {
  return (
    <FooterWrap>
      <SectionDiv>
        <Inner>
          <Top>
            {/* Brand */}
            <BrandCol>
              <BrandRow>
                <LogoBox src={etsuLogo}></LogoBox>
                <BrandText>
                  <BrandTitle>ETSU</BrandTitle>
                  <BrandSub>Project Hub</BrandSub>
                </BrandText>
              </BrandRow>

              <BrandDesc>
                ETSU Department of Computing&apos;s central hub for research
                projects and thesis work.
              </BrandDesc>
            </BrandCol>

            {/* Quick Links */}
            <QuickCol>
              <Heading>Quick Links</Heading>
              <List>
                <li>
                  <NavLink to="/">Home</NavLink>
                </li>
                <li>
                  <NavLink to="/projects">Projects</NavLink>
                </li>
                <li>
                  <NavLink to="/theses">Theses</NavLink>
                </li>
                <li>
                  <NavLink to="/about">About</NavLink>
                </li>
              </List>
            </QuickCol>

            {/* Resources */}
            <ResourcesCol>
              <Heading>Resources</Heading>
              <List>
                <li>
                  <PlainLink href="#research-guidelines">
                    Research Guidelines
                  </PlainLink>
                </li>
                <li>
                  <PlainLink href="#submit-project">Submit Project</PlainLink>
                </li>
                <li>
                  <PlainLink href="#faculty-portal">Faculty Portal</PlainLink>
                </li>
                <li>
                  <PlainLink href="#student-portal">Student Portal</PlainLink>
                </li>
              </List>
            </ResourcesCol>

            {/* Contact */}
            <ContactCol>
              <Heading>Contact</Heading>
              <ContactList>
                <ContactItem>
                  <Icon>
                    <FiMapPin />
                  </Icon>
                  <ContactText>
                    <ContactValue>
                      1276 Gilbreath Dr., Box 70300, Johnson City, TN
                    </ContactValue>
                  </ContactText>
                </ContactItem>

                <ContactItem>
                  <Icon>
                    <FiPhone />
                  </Icon>
                  <ContactText>
                    <ContactValue>
                      <PlainLink href="tel:+14234391000">
                        (423) 439-1000
                      </PlainLink>
                    </ContactValue>
                  </ContactText>
                </ContactItem>

                <ContactItem>
                  <Icon>
                    <FiMail />
                  </Icon>
                  <ContactText>
                    <ContactValue>
                      <PlainLink href="mailto:research@etsu.edu">
                        research@etsu.edu
                      </PlainLink>
                    </ContactValue>
                  </ContactText>
                </ContactItem>
              </ContactList>
            </ContactCol>
          </Top>

          <Divider />

          <Bottom>
            <Copyright>
              © {new Date().getFullYear()} East Tennessee State University. All
              rights reserved.
            </Copyright>

            <BottomLinks>
              <PlainLink href="#privacy">Privacy Policy</PlainLink>
              <PlainLink href="#terms">Terms of Use</PlainLink>
              <PlainLink href="#accessibility">Accessibility</PlainLink>
            </BottomLinks>
          </Bottom>
        </Inner>
      </SectionDiv>
    </FooterWrap>
  );
};

export default Footer;

/* styling*/

const FooterWrap = styled.footer`
  background: ${Colors.blue};

  color: rgba(255, 255, 255, 0.9);
  padding-top: 2rem;
`;

const Inner = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Top = styled.div`
  display: grid;
  gap: 2.2rem;

  /* Small screen layout:
     
  */
  grid-template-columns: 1fr 1fr;
  grid-template-areas:
    "brand brand"
    "quick resources"
    "contact contact";

  @media ${media.tablet} {
    /* Medium layout:
     
    */
    grid-template-areas:
      "brand quick"
      "resources contact";
  }

  @media ${media.laptop} {
    /* Large layout:
      
    */
    grid-template-columns: 1.2fr 0.9fr 0.9fr 1.2fr;
    grid-template-areas: "brand quick resources contact";
    align-items: start;
  }
`;

const BrandCol = styled.div`
  grid-area: brand;
`;

const QuickCol = styled.div`
  grid-area: quick;
`;

const ResourcesCol = styled.div`
  grid-area: resources;
`;

const ContactCol = styled.div`
  grid-area: contact;
`;

const Heading = styled.h5`
  margin: 0 0 1rem 0;
  font-weight: 500;
  color: ${Colors.white};
`;

const BrandRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const LogoBox = styled.img`
  width: 52px;
  height: 52px;
  border-radius: 12px;
  background: ${Colors.etsuGold};
  color: ${Colors.etsuBlue};
  display: grid;
  place-items: center;
  font-weight: 900;
  font-size: 1.6rem;
`;

const BrandText = styled.div``;

const BrandTitle = styled.div`
  font-weight: 800;
  font-size: 1.2rem;
  line-height: 1.2rem;
  color: ${Colors.white};
`;

const BrandSub = styled.div`
  margin-top: 0.35rem;
  font-size: 0.75rem;

  opacity: 0.85;
`;

const BrandDesc = styled.p`
  @media ${media.tablet} {
    max-width: 360px;
  }
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.75rem;
`;

const NavLink = styled(Link)`
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;

  &:hover {
    color: ${Colors.white};
    text-decoration: underline;
  }
`;

const PlainLink = styled.a`
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;

  &:hover {
    color: ${Colors.white};
    text-decoration: underline;
  }
`;

const ContactList = styled.div`
  display: grid;
  gap: 1.1rem;
`;

const ContactItem = styled.div`
  display: grid;
  grid-template-columns: 24px 1fr;
  gap: 0.9rem;
  align-items: start;
`;

const Icon = styled.div`
  color: ${Colors.etsuGold};
  font-size: 1.25rem;
  margin-top: 0.1rem;
`;

const ContactText = styled.div``;

const ContactLabel = styled.div`
  font-weight: 700;
  color: ${Colors.white};
  margin-bottom: 0.2rem;
`;

const ContactValue = styled.div`
  opacity: 0.85;
  line-height: 1.35rem;
`;

const Divider = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.12);
  margin: 2.4rem 0 1.6rem;
`;

const Bottom = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media ${media.tablet} {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const Copyright = styled.div`
  opacity: 0.8;
`;

const BottomLinks = styled.div`
  display: flex;
  gap: 1.4rem;
  flex-wrap: wrap;

  @media ${media.tablet} {
    justify-content: flex-end;
  }
`;
