import styled from "styled-components";
import { Colors } from "../theme/Colors";
import { useEffect, useRef, useState } from "react";

const DeleteUserModal = ({ user, onClose, onConfirm }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (!user) return null;

  // 1. Duck typing to figure out who we are deleting
  const isSupervisor = Boolean(user?.fullname || user?.speciality);

  // 2. Dynamically set the display name and entity type
  const entityType = isSupervisor ? "Supervisor" : "User";
  const displayName = isSupervisor
    ? user.fullname
    : `${user.first_name} ${user.last_name}`;

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError("");

      await onConfirm(user);

      setSuccess(true);

      timerRef.current = setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err) {
      setError(err.message || `Failed to delete ${entityType.toLowerCase()}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay onClick={!loading && !success ? onClose : undefined}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        {!success ? (
          <>
            <Title>Delete {entityType}</Title>

            <Message>
              Are you sure you want to delete <strong>{displayName}</strong>?
            </Message>

            <SubText>This action cannot be undone.</SubText>

            {error && <ErrorText>{error}</ErrorText>}

            <BtnRow>
              <CancelBtn onClick={onClose} disabled={loading}>
                Cancel
              </CancelBtn>
              <DeleteBtn onClick={handleDelete} disabled={loading}>
                {loading ? "Deleting..." : "Yes, Delete"}
              </DeleteBtn>
            </BtnRow>
          </>
        ) : (
          <>
            <SuccessIcon>✓</SuccessIcon>
            <SuccessTitle>{entityType} Deleted</SuccessTitle>
            <SuccessText>
              <strong>{displayName}</strong> has been successfully removed.
            </SuccessText>
          </>
        )}
      </ModalCard>
    </Overlay>
  );
};

export default DeleteUserModal;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  backdrop-filter: blur(2px);
  background: rgba(4, 30, 66, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1200;
`;

const ModalCard = styled.div`
  width: 100%;
  max-width: 420px;
  background: ${Colors.white};
  border-radius: 20px;
  padding: 28px;
  text-align: center;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.15);
`;

const Title = styled.h3`
  margin: 0 0 12px;
  font-size: 22px;
  font-weight: 800;
  color: ${Colors.etsuBlue};
`;

const Message = styled.p`
  font-size: 16px;
  color: ${Colors.darkGray};
  line-height: 1.5;
`;

const SubText = styled.p`
  font-size: 13px;
  color: ${Colors.lightBlack};
  margin-top: 8px;
`;

const BtnRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
`;

const CancelBtn = styled.button`
  padding: 10px 18px;
  border-radius: 10px;
  border: 1px solid ${Colors.lightGray};
  background: ${Colors.white};
  cursor: pointer;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const DeleteBtn = styled.button`
  padding: 10px 18px;
  border-radius: 10px;
  border: none;
  background: #d62828;
  color: white;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const SuccessIcon = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  border-radius: 50%;
  background: rgba(255, 184, 28, 0.2);
  color: ${Colors.etsuBlue};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 900;
`;

const SuccessTitle = styled.h3`
  margin: 0 0 8px;
  font-size: 22px;
  font-weight: 800;
  color: ${Colors.etsuBlue};
`;

const SuccessText = styled.p`
  font-size: 15px;
  color: ${Colors.darkGray};
  line-height: 1.5;
`;

const ErrorText = styled.p`
  margin-top: 12px;
  font-size: 14px;
  color: #d62828;
  font-weight: 600;
`;
