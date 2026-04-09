// src/components/NoResultsState.jsx
import React from "react";
import styled, { keyframes } from "styled-components";
import { FaSearch } from "react-icons/fa";

export default function NoResultsState({
  query = "",
  title = "No results found",
  subtitle,
}) {
  return (
    <Wrap>
      <IconBubble>
        <FaSearch />
      </IconBubble>

      <Title>{title}</Title>

      <Subtitle>
        {subtitle ||
          (query
            ? <>No matches found for <strong>"{query}"</strong>.</>
            : "Try adjusting your search or filters.")}
      </Subtitle>
    </Wrap>
  );
}

const floatIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.04); }
  100% { transform: scale(1); }
`;

const Wrap = styled.div`
  min-height: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: ${floatIn} 0.25s ease;
  text-align: center;
  padding: 24px 16px;
`;

const IconBubble = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  margin-bottom: 14px;
  background: rgba(4, 30, 66, 0.08);
  color: #041e42;
  font-size: 22px;
  animation: ${pulse} 1.8s ease-in-out infinite;
`;

const Title = styled.h3`
  margin: 0 0 8px;
  font-size: 18px;
  color: #111827;
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
`;