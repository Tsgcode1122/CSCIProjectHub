import React, { useState, useEffect, useCallback } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { motion, AnimatePresence, color } from "framer-motion";
import { Squash as Hamburger } from "hamburger-react";
import { IoIosArrowDropright } from "react-icons/io";
import etsuLogo from "../images/etsuE.png";
import { Colors, Gradients, Shadows } from "../theme/Colors";
import { breakpoints, media } from "../theme/Breakpoints";
import { Col } from "antd";
import { BorderRadius } from "../theme/BorderRadius";
import SectionDiv from "./SectionDiv";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Projects", to: "/projects" },
    { label: "Theses", to: "/theses" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
  ];

  return (
    <>
      <NavContainer>
        <Wrapper>
          <LogoContainer to="/">
            <LogoBox src={etsuLogo}></LogoBox>
            <LogoText>
              <h1>ETSU</h1>
              <p>Project Hub</p>
            </LogoText>
          </LogoContainer>

          {/* Desktop Navigation */}
          <NavLinks>
            {navLinks.map((link) => (
              <StyledNavLink key={link.to} to={link.to}>
                {link.label}
              </StyledNavLink>
            ))}
          </NavLinks>

          {/* Mobile Navigation Icon */}
          <MobileMenuIcon>
            <Hamburger
              toggled={isOpen}
              toggle={setIsOpen}
              color="#041E42"
              size={24}
            />
          </MobileMenuIcon>
        </Wrapper>
      </NavContainer>

      {/* Spacer to prevent content from jumping under the fixed navbar */}
      <NavSpacer />

      {/* Mobile Menu Dropdown with Animation */}
      <AnimatePresence>
        {isOpen && (
          <MobileMenu
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            {navLinks.map((link) => (
              <StyledNavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
              >
                {link.label} <IoIosArrowDropright />
              </StyledNavLink>
            ))}
          </MobileMenu>
        )}
      </AnimatePresence>

      {isOpen && <Overlay onClick={() => setIsOpen(false)} />}
    </>
  );
};

// styling
const NavContainer = styled(motion.header)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: #eae9e9;
  /* box-shadow: ${Shadows.light}; */
  z-index: 1000;
  border-bottom: 1.5px solid ${Colors.lightGray};
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  height: 70px;

  @media ${media.mobileXS} {
    padding: 0 0.5rem;
  }
  @media ${media.mobileS} {
    padding: 0 0.7rem;
  }
  @media ${media.mobileL} {
    padding: 0 1rem;
  }
  @media ${media.desktopXL} {
    max-width: 1400px;
  }
`;

const LogoContainer = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
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

const LogoText = styled.div`
  display: flex;
  flex-direction: column;

  h1 {
    font-family: "Philosopher", sans-serif;
    color: ${Colors.brightBlue};
    font-size: 1.2rem;
    line-height: 1.1;
    margin: 0;
    padding: 0;
  }

  p {
    color: ${Colors.darkGray};
    margin: 0;
    font-size: 0.6rem;
    line-height: 1.2;
  }
`;

const NavLinks = styled.nav`
  display: none;
  @media ${media.tablet} {
    display: flex;
    align-items: flex-start;
    gap: 2.5rem;
  }
`;

const StyledNavLink = styled(NavLink)`
  font-size: 1rem;
  font-weight: 500;
  color: ${Colors.darkGray};
  text-decoration: none;
  position: relative;
  padding: 0.5rem 0;
  transition: color 0.3s ease;
  text-align: center;
  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: none;
    @media ${media.tablet} {
      background-color: ${Colors.etsuGold};
    }
    transition: width 0.3s ease;
  }

  &:hover {
    color: ${Colors.etsuBlue};
  }

  &:hover::after {
    width: 100%;
  }

  &.active {
    color: ${Colors.etsuBlue};
    font-weight: 700;
  }
`;

const MobileMenuIcon = styled.div`
  display: block; /* Show on tablet and smaller */
  @media ${media.tablet} {
    display: none;
  }
`;

const MobileMenu = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  z-index: 1100;
  background: ${Colors.white};
  position: fixed;
  top: 71.5px;
  right: 0;
  width: 50%;
  height: 100vh;
  padding: 0.8rem;
  box-shadow: ${Shadows.light};

  ${StyledNavLink} {
    text-align: left;
    /* width: 100%; */
    padding: 10px;

    border-radius: ${BorderRadius.medium};
    border: 1px solid ${Colors.lightGray};
    display: flex;
    align-items: center;
    justify-content: space-between;
    &:hover {
      border: 1px solid ${Colors.etsuBlue};
    }
  }
  ${MobileMenuIcon} {
    display: flex;
    align-self: flex-end;
    align-items: center;
  }
`;
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  z-index: 1;
`;
const NavSpacer = styled.div`
  height: 70px;
`;

export default Navbar;
