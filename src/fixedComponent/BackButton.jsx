import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { Colors } from "../theme/Colors";

const BackButton = ({ label }) => {
  const navigate = useNavigate();

  return (
    <Wrapper onClick={() => navigate(-1)}>
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
`;
