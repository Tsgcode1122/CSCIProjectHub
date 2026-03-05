import styled from "styled-components";
import { NavLink } from "react-router-dom";

export const Page = styled.div`
  min-height: 100vh;
  display: flex;
  background: #0b0f17;
  color: #e8eefc;
`;

export const Shell = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const Topbar = styled.div`
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 18px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.02);
`;

export const Brand = styled.div`
  font-weight: 700;
`;

export const Content = styled.main`
  padding: 18px;
`;

export const Sidebar = styled.aside`
  width: 260px;
  border-right: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.02);
  padding: 14px;
`;

export const SideTitle = styled.div`
  font-size: 12px;
  opacity: 0.75;
  margin: 8px 8px 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

export const SideLink = styled(NavLink)`
  display: flex;
  padding: 10px 10px;
  border-radius: 12px;
  text-decoration: none;
  color: #e8eefc;

  &.active {
    background: rgba(99, 102, 241, 0.18);
    border: 1px solid rgba(99, 102, 241, 0.35);
  }

  &:hover {
    background: rgba(255,255,255,0.06);
  }
`;

export const Card = styled.div`
  border: 1px solid rgba(255,255,255,0.10);
  background: rgba(255,255,255,0.03);
  border-radius: 16px;
  padding: 14px;
`;

export const Button = styled.button`
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.06);
  color: #e8eefc;
  padding: 10px 12px;
  border-radius: 12px;
  cursor: pointer;

  &:hover {
    background: rgba(255,255,255,0.10);
  }
`;

export const PrimaryButton = styled(Button)`
  background: rgba(99, 102, 241, 0.25);
  border: 1px solid rgba(99, 102, 241, 0.45);
`;

export const Input = styled.input`
  width: 100%;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(0,0,0,0.25);
  color: #e8eefc;
  padding: 10px 12px;
  border-radius: 12px;
`;

export const Label = styled.label`
  font-size: 12px;
  opacity: 0.85;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;