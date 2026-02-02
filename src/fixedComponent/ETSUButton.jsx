import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { Colors, Shadows } from "../theme/Colors";
import { media } from "../theme/Breakpoints";

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;

  padding: 0.85rem 1.6rem;
  cursor: pointer;
  @media ${media.mobileXS} {
    padding: 0.5rem 1rem;
  }
  background: ${Colors.etsuGold};
  color: ${Colors.etsuBlue};

  font-weight: 600;
  letter-spacing: 0.02em;

  border: none;
  border-radius: 10px;
  box-shadow: ${Shadows.medium};

  transition:
    transform 160ms ease,
    box-shadow 160ms ease;

  &:hover {
    transform: translateY(-0.02px);
    box-shadow: ${Shadows.heavy};
  }

  &:active {
    transform: translateY(0);
    box-shadow: ${Shadows.medium};
  }

  svg {
    transition: transform 160ms ease;
  }

  &:hover svg {
    transform: translateX(4px);
  }
`;

export default function ETSUButton({ text, to }) {
  const navigate = useNavigate();

  return (
    <Button onClick={() => navigate(to)}>
      {text}
      <FiArrowRight size={18} />
    </Button>
  );
}
