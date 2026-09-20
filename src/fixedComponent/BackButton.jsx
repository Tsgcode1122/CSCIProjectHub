import React from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { Colors } from "../theme/Colors";

const BackButton = ({ label }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    const path = location.pathname;

    // Detail pages return to their matching collection page.
    if (path.startsWith("/theses/") && path !== "/theses") {
      navigate("/theses");
    }

    else if (path.startsWith("/projects/") && path !== "/projects") {
      navigate("/projects");
    }

    else {
      navigate(-1);
    }
  };

  return (
    <Wrapper type="button" onClick={handleBack} aria-label={label}>
      <FiArrowLeft aria-hidden="true" />
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
