import React from "react";
import styled, { keyframes } from "styled-components";
import { ETSU_NAVY, MUTED, BORDER } from "../dashboardStyles";

export default function LoadingScreen({
  title = "Loading...",
  subtitle = "Please wait while we fetch the data.",
  compact = false,
}) {
  return (
    <Wrap $compact={compact}>
      <Card>
        <Spinner />
        <Title>{title}</Title>
        <Subtitle>{subtitle}</Subtitle>
      </Card>
    </Wrap>
  );
}

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const Wrap = styled.div`
  min-height: ${({ $compact }) => ($compact ? "280px" : "calc(100vh - 84px)")};
  display: grid;
  place-items: center;
  padding: 24px;
`;

const Card = styled.div`
  min-width: 280px;
  max-width: 420px;
  text-align: center;
  background: white;
  border: 1px solid ${BORDER};
  border-radius: 18px;
  padding: 28px 24px;
  box-shadow: 0 10px 28px rgba(4, 30, 66, 0.06);
`;

const Spinner = styled.div`
  width: 42px;
  height: 42px;
  margin: 0 auto 16px;
  border-radius: 999px;
  border: 4px solid rgba(4, 30, 66, 0.12);
  border-top-color: ${ETSU_NAVY};
  animation: ${spin} 0.75s linear infinite;
`;

const Title = styled.h3`
  margin: 0 0 8px;
  color: ${ETSU_NAVY};
  font-size: 22px;
`;

const Subtitle = styled.p`
  margin: 0;
  color: ${MUTED};
  font-size: 14px;
  line-height: 1.5;
`;