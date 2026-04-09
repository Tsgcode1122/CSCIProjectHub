import React from "react";
import styled from "styled-components";
import { Spin } from "antd";

export default function PageLoader({ text = "Loading..." }) {
  return (
    <Wrap>
      <Spin size="large" />
      <Text>{text}</Text>
    </Wrap>
  );
}

const Wrap = styled.div`
  min-height: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
`;

const Text = styled.div`
  color: #6b7280;
  font-weight: 600;
`;