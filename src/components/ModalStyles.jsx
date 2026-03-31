import styled, { css } from "styled-components";
import { Colors } from "../theme/Colors";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(4, 30, 66, 0.35);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  z-index: 1000;
`;

export const ModalCard = styled.div`
  width: 100%;
  max-width: 760px;
  max-height: 90vh;
  background: ${Colors.white};
  border-radius: 24px;
  overflow-y: auto;
  box-shadow: 0 28px 70px rgba(4, 30, 66, 0.2);
  border: 1px solid rgba(4, 30, 66, 0.08);

  @media (max-width: 768px) {
    max-width: 95%;
    max-height: 92vh;
    border-radius: 18px;
  }
`;

export const Header = styled.div`
  background: ${Colors.lightGray};
  padding: 22px 28px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 28px;
    width: 60px;
    height: 3px;
    background: ${Colors.etsuGold};
    border-radius: 4px;
  }
`;

export const HeaderTextWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Title = styled.h2`
  margin: 0;
  color: ${Colors.etsuBlue};
  font-size: 26px;
  font-weight: 800;
`;

export const Subtitle = styled.p`
  margin: 0;
  color: ${Colors.darkGray};
  font-size: 14px;
  opacity: 0.85;
`;

export const CloseButton = styled.button`
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: ${Colors.white};
  color: ${Colors.darkGray};
  font-size: 22px;
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0.06);
`;

export const FormBody = styled.div`
  padding: 28px;
  max-height: calc(100vh - 100px);
`;

export const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const TwoCol = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 700;
  color: ${Colors.etsuBlue};
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const sharedInputStyles = css`
  width: 100%;
  min-height: 54px;
  border-radius: 14px;
  border: 1.5px solid rgba(4, 30, 66, 0.14);
  background: ${Colors.lightGray};
  padding: 0 16px;
  font-size: 15px;
  color: ${Colors.darkGray};
  outline: none;
  box-sizing: border-box;

  &:disabled {
    cursor: not-allowed;
    opacity: 1;
    color: ${Colors.darkGray};
    background: ${Colors.lightGray};
  }
`;

export const Input = styled.input`
  ${sharedInputStyles}
`;

export const Select = styled.select`
  ${sharedInputStyles}
`;

export const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 14px;
  padding-top: 6px;
`;

export const CloseActionButton = styled.button`
  min-width: 130px;
  height: 50px;
  border-radius: 14px;
  border: none;
  background: ${Colors.etsuBlue};
  color: ${Colors.white};
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
`;
export const Required = styled.span`
  color: #d62828;
  font-size: 16px;
  line-height: 1;
`;
export const CancelButton = styled.button`
  min-width: 130px;
  height: 50px;
  border-radius: 14px;
  border: 1.5px solid rgba(4, 30, 66, 0.16);
  background: ${Colors.white};
  color: ${Colors.etsuBlue};
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    background: ${Colors.lightGray};
  }
`;

export const SuccessText = styled.p`
  margin: 0;
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(22, 163, 74, 0.08);
  color: #15803d;
  font-size: 14px;
  font-weight: 600;
`;
export const SuccessOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(4, 30, 66, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1200;
`;

export const SuccessCard = styled.div`
  width: 100%;
  max-width: 420px;
  background: ${Colors.white};
  border-radius: 22px;
  padding: 32px 24px;
  text-align: center;
  box-shadow: 0 24px 60px rgba(4, 30, 66, 0.16);
  border: 1px solid rgba(4, 30, 66, 0.08);
`;

export const SuccessIcon = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto 18px;
  border-radius: 50%;
  background: rgba(255, 184, 28, 0.16);
  color: ${Colors.etsuBlue};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  font-weight: 800;
`;

export const SuccessTitle = styled.h3`
  margin: 0 0 10px;
  font-size: 24px;
  font-weight: 800;
  color: ${Colors.etsuBlue};
`;
export const SubmitButton = styled.button`
  min-width: 160px;
  height: 50px;
  border: none;
  border-radius: 14px;
  background: ${Colors.etsuBlue};
  color: ${Colors.white};
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;
export const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const EyeButton = styled.button`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 18px;
  color: ${Colors.darkGray};

  &:hover {
    opacity: 0.7;
  }
`;
