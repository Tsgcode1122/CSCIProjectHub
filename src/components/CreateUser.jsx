import React, { useState } from "react";
import styled from "styled-components";
import { Colors } from "../theme/Colors";
import { FiEye, FiEyeOff } from "react-icons/fi";
import {
  Overlay,
  ModalCard,
  Header,
  HeaderTextWrap,
  Title,
  Subtitle,
  CloseButton,
  FormBody,
  TwoCol,
  Field,
  CancelButton,
  Label,
  Required,
  ButtonRow,
  SuccessTitle,
  SuccessIcon,
  SuccessCard,
  SuccessOverlay,
  SuccessText,
  sharedInputStyles,
  InputWrapper,
  EyeButton,
} from "../components/ModalStyles";

const STORAGE_KEY = "capstone_admin_session";
const API_BASE = "https://crpp-project.onrender.com";

const departments = [
  "Computer Science",
  "Information Technology",
  "Information Systems",
  "Cybersecurity",
  "Data Science",
];

const roles = ["admin", "faculty"];

// 1. Added isSupervisor prop (defaults to false so regular Users page doesn't break)
const CreateUserModal = ({ onClose, onSuccess, isSupervisor = false }) => {
  const [form, setForm] = useState({
    etsu_email: "",
    password: "",
    first_name: "",
    last_name: "",
    fullname: "", // Added for Supervisor
    speciality: "", // Added for Supervisor
    role: "",
    department: "",
    major: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const storedUser = sessionStorage.getItem(STORAGE_KEY);
      const user = storedUser ? JSON.parse(storedUser) : null;
      const token = user?.access_token;

      if (!token) {
        throw new Error("No access token found in session storage");
      }

      // 2. Dynamically set the endpoint
      const endpoint = isSupervisor
        ? `${API_BASE}/supervisors/`
        : `${API_BASE}/users/`;

      // 3. Dynamically build the exact payload required
      const payload = isSupervisor
        ? {
            fullname: form.fullname.trim(),
            speciality: form.speciality.trim(),
            designation: "",
          }
        : {
            etsu_email: form.etsu_email.trim(),
            password: form.password,
            first_name: form.first_name.trim(),
            last_name: form.last_name.trim(),
            role: form.role,
            department: form.department,
            major: form.major.trim(),
          };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      let data = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok) {
        if (
          res.status === 409 ||
          data?.message?.toLowerCase().includes("already exists") ||
          data?.detail?.toLowerCase().includes("already exists")
        ) {
          throw new Error(
            `A ${isSupervisor ? "supervisor" : "user"} with this info already exists.`,
          );
        }

        const errorMsg = data?.detail
          ? Array.isArray(data.detail)
            ? data.detail[0].msg
            : String(data.detail)
          : data?.message;

        throw new Error(errorMsg || `Failed to create (${res.status})`);
      }

      setSuccessOpen(true);

      // Reset form
      setForm({
        etsu_email: "",
        password: "",
        first_name: "",
        last_name: "",
        fullname: "",
        speciality: "",
        role: "",
        department: "",
        major: "",
      });

      setTimeout(() => {
        setSuccessOpen(false);
        if (onSuccess) onSuccess(data);
      }, 2000);
    } catch (err) {
      setError(
        err.message ||
          `Failed to create ${isSupervisor ? "supervisor" : "user"}.`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Overlay onClick={onClose}>
        <ModalCard onClick={(e) => e.stopPropagation()}>
          <Header>
            <HeaderTextWrap>
              <Title>Create {isSupervisor ? "Supervisor" : "User"}</Title>
              <Subtitle>
                Add a new {isSupervisor ? "supervisor" : "user"} to the CSCI
                Project Hub system.
              </Subtitle>
            </HeaderTextWrap>

            <CloseButton type="button" onClick={onClose}>
              ×
            </CloseButton>
          </Header>

          <FormBody>
            <Form onSubmit={handleSubmit}>
              {/* 4. Conditional UI Rendering */}
              {isSupervisor ? (
                <>
                  <Field>
                    <Label>
                      Full Name <Required>*</Required>
                    </Label>
                    <Input
                      type="text"
                      name="fullname"
                      value={form.fullname}
                      onChange={handleChange}
                      placeholder="e.g. Dr. Jane Doe"
                      required
                    />
                  </Field>

                  <Field>
                    <Label>Speciality</Label>
                    <Input
                      type="text"
                      name="speciality"
                      value={form.speciality}
                      onChange={handleChange}
                      placeholder="e.g. Artificial Intelligence"
                    />
                  </Field>
                </>
              ) : (
                <>
                  <TwoCol>
                    <Field>
                      <Label>
                        First Name <Required>*</Required>
                      </Label>
                      <Input
                        type="text"
                        name="first_name"
                        value={form.first_name}
                        onChange={handleChange}
                        placeholder="Enter first name"
                        required
                      />
                    </Field>

                    <Field>
                      <Label>
                        Last Name <Required>*</Required>
                      </Label>
                      <Input
                        type="text"
                        name="last_name"
                        value={form.last_name}
                        onChange={handleChange}
                        placeholder="Enter last name"
                        required
                      />
                    </Field>
                  </TwoCol>

                  <Field>
                    <Label>
                      ETSU Email <Required>*</Required>
                    </Label>
                    <Input
                      type="email"
                      name="etsu_email"
                      value={form.etsu_email}
                      onChange={handleChange}
                      placeholder="Enter ETSU email"
                      required
                    />
                  </Field>
                  <Field>
                    <Label>
                      Password <Required>*</Required>
                    </Label>

                    <InputWrapper>
                      <Input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                      />

                      <EyeButton
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </EyeButton>
                    </InputWrapper>
                  </Field>

                  <TwoCol>
                    <Field>
                      <Label>
                        Role <Required>*</Required>
                      </Label>
                      <Select
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select role</option>
                        {roles.map((role) => (
                          <option key={role} value={role}>
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                          </option>
                        ))}
                      </Select>
                    </Field>

                    <Field>
                      <Label>Program</Label>
                      <Select
                        name="department"
                        value={form.department}
                        onChange={handleChange}
                      >
                        <option value="">Select Program</option>
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </Select>
                    </Field>
                  </TwoCol>

                  <Field>
                    <Label>Major</Label>
                    <Input
                      type="text"
                      name="major"
                      value={form.major}
                      onChange={handleChange}
                      placeholder="Enter major"
                    />
                  </Field>
                </>
              )}

              {error && <ErrorText>{error}</ErrorText>}

              <ButtonRow>
                <CancelButton type="button" onClick={onClose}>
                  Cancel
                </CancelButton>
                <SubmitButton type="submit" disabled={loading}>
                  {loading
                    ? "Creating..."
                    : `Create ${isSupervisor ? "Supervisor" : "User"}`}
                </SubmitButton>
              </ButtonRow>
            </Form>
          </FormBody>
        </ModalCard>
        {successOpen && (
          <SuccessOverlay>
            <SuccessCard>
              <SuccessIcon>✓</SuccessIcon>
              <SuccessTitle>
                {isSupervisor ? "Supervisor" : "User"} Created
              </SuccessTitle>
              <SuccessText>
                The new {isSupervisor ? "supervisor" : "user"} has been added to
                the database successfully.
              </SuccessText>
            </SuccessCard>
          </SuccessOverlay>
        )}
      </Overlay>
    </>
  );
};

export default CreateUserModal;

const SubmitButton = styled.button`
  min-width: 160px;
  height: 50px;
  border: none;
  border-radius: 14px;
  background: ${Colors.etsuBlue};
  color: ${Colors.white};
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.22s ease;

  &:hover {
    background: ${Colors.blue};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorText = styled.p`
  margin: 0;
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(214, 40, 40, 0.08);
  color: #b42318;
  font-size: 14px;
  font-weight: 600;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Input = styled.input`
  ${sharedInputStyles}
`;

const Select = styled.select`
  ${sharedInputStyles}
  cursor: pointer;
`;
