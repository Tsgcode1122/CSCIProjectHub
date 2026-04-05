import React, { useEffect, useState } from "react";
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
  InputWrapper,
  EyeButton,
  sharedInputStyles,
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

const EditUserModal = ({ user, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    etsu_email: "",
    first_name: "",
    last_name: "",
    fullname: "", // Added for Supervisor
    speciality: "", // Added for Supervisor
    role: "",
    department: "",
    major: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);

  // 1. Duck typing to figure out who we are editing
  const isSupervisor = Boolean(user?.fullname || user?.speciality);

  useEffect(() => {
    if (user) {
      setForm({
        etsu_email: user?.etsu_email || user?.email || "",
        first_name: user?.first_name || "",
        last_name: user?.last_name || "",
        fullname: user?.fullname || "",
        speciality: user?.speciality || "",
        role: user?.role || "",
        department: user?.department || "",
        major: user?.major || "",
        password: "", // Kept blank so we don't accidentally save dots as a password!
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const storedSession = sessionStorage.getItem(STORAGE_KEY);
      const session = storedSession ? JSON.parse(storedSession) : null;
      const token = session?.access_token;

      if (!token) {
        throw new Error("No access token found in session storage");
      }

      // 2. Dynamically pick the right endpoint
      const endpoint = isSupervisor
        ? `${API_BASE}/supervisors/${user.id}`
        : `${API_BASE}/users/${user.id}`;

      const method = isSupervisor ? "PUT" : "PATCH";

      // 4. Dynamically build the perfect payload so the backend doesn't crash with a 422
      const payload = isSupervisor
        ? {
            fullname: form.fullname.trim(),
            speciality: form.speciality.trim(),
            designation: "",
          }
        : {
            etsu_email: form.etsu_email.trim(),
            first_name: form.first_name.trim(),
            last_name: form.last_name.trim(),
            role: form.role,
            department: form.department,
            major: form.major.trim(),
            ...(form.password ? { password: form.password } : {}), // Only send password if they typed a new one
          };

      const res = await fetch(endpoint, {
        method: method,
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
          data?.message?.toLowerCase()?.includes("already exists")
        ) {
          throw new Error("A user with this email already exists.");
        }

        // Grab the detailed error if the FastAPI backend throws a 422
        const errorMsg = data?.detail
          ? Array.isArray(data.detail)
            ? data.detail[0].msg
            : String(data.detail)
          : data?.message;

        throw new Error(errorMsg || `Failed to update (${res.status})`);
      }

      setSuccessOpen(true);

      setTimeout(() => {
        setSuccessOpen(false);
        if (onSuccess) onSuccess(data);
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to update details.");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <Header>
          <HeaderTextWrap>
            <Title>{isSupervisor ? "Edit Supervisor" : "Edit User"}</Title>
            <Subtitle>
              Update the selected {isSupervisor ? "supervisor's" : "user's"}{" "}
              information.
            </Subtitle>
          </HeaderTextWrap>

          <CloseButton type="button" onClick={onClose}>
            ×
          </CloseButton>
        </Header>

        <FormBody>
          <Form onSubmit={handleSubmit}>
            {/* --- CONDITIONAL RENDERING --- */}
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
                    required
                  />
                </Field>

                <Field>
                  <Label>New Password</Label>
                  <InputWrapper>
                    <Input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Leave blank to keep current password"
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
                  />
                </Field>
              </>
            )}

            {error && <ErrorText>{error}</ErrorText>}

            <ButtonRow>
              <CancelButton type="button" onClick={onClose}>
                Cancel
              </CancelButton>
              <SubmitButton type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
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
              {isSupervisor ? "Supervisor" : "User"} Updated
            </SuccessTitle>
            <SuccessText>
              The {isSupervisor ? "supervisor" : "user"} details have been
              updated successfully.
            </SuccessText>
          </SuccessCard>
        </SuccessOverlay>
      )}
    </Overlay>
  );
};

export default EditUserModal;

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

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
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
