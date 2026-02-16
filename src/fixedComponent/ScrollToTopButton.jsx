import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { RiArrowUpSLine } from "react-icons/ri";
import bgg from "../images/down.png";
import styled from "styled-components";
import { Colors, Gradients, Shadows } from "../theme/Colors";

const ScrollToTop = styled.div`
  position: fixed;
  bottom: 20px;
  height: 40px;
  right: 20px;
  width: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${Colors.brightBlue};
  z-index: 999 !important;
  box-shadow: ${Shadows.light};

  border-radius: 50%;
  transition:
    background-color 0.3s ease,
    transform 0.3s ease;
  animation: pulse 2s infinite;
  svg {
    font-size: 30px;
    color: white;
  }
  @media screen and (max-width: 320px) {
    right: 10px;
  }
  @media (min-width: 321px) and (max-width: 399px) {
    right: 10px;
  }
  @media (min-width: 400px) and (max-width: 499px) {
    right: 10px;
  }
  &:hover {
    transform: scale(1.01);
    animation: none;
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.03);
    }
    100% {
      transform: scale(1);
    }
  }
`;
const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation(); // Get the current route

  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    const windowHeight = window.innerHeight;
    const scrollPercentage = (scrollTop / (scrollHeight - windowHeight)) * 100;
    setIsVisible(scrollPercentage > 10);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    isVisible && (
      <ScrollToTop onClick={scrollToTop}>
        <RiArrowUpSLine />
      </ScrollToTop>
    )
  );
};

export default ScrollToTopButton;
