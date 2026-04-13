import React from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import { FiArrowLeft } from "react-icons/fi";
import { Colors } from "../theme/Colors";

const BackButton = ({ label }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    const path = location.pathname;

    // 1. Check if we are on a Thesis details page (e.g., /theses/id)
    if (path.startsWith("/theses/") && path !== "/theses") {
      navigate("/theses");
    }

    // 2. Check if we are on a Project details page (e.g., /projects/id)
    else if (path.startsWith("/projects/") && path !== "/projects") {
      navigate("/projects");
    }

    // 3. Default behavior for main listing pages or other screens
    else {
      navigate(-1);
    }
  };

  return (
    <Wrapper onClick={handleBack}>
      <FiArrowLeft />
      <span>{label}</span>
    </Wrapper>
  );
};

export default BackButton;

const Wrapper = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;

  background: transparent;
  border: none;
  cursor: pointer;

  color: ${Colors.white};
  font-weight: 600;

  padding: 0rem 0;

  svg {
    font-size: 1.1rem;
  }

  &:hover {
    text-decoration: underline;
  }

  text-transform: capitalize;
`;
