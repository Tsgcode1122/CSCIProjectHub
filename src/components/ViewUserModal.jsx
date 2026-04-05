import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Colors } from "../theme/Colors";
import {
  Overlay,
  ModalCard,
  Header,
  HeaderTextWrap,
  Title,
  Subtitle,
  CloseButton,
  FormBody,
  Form,
  TwoCol,
  Field,
  Label,
  Input,
  Select,
  ButtonRow,
  CloseActionButton,
} from "../components/ModalStyles";

const programs = [
  "Computer Science",
  "Information Technology",
  "Information Systems",
  "Cybersecurity",
  "Data Science",
];

const roles = ["admin", "faculty"];

const ViewUserModal = ({ user, onClose }) => {
  // 1. Expand the state to hold ALL possible fields
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

  useEffect(() => {
    if (user) {
      setForm({
        etsu_email: user?.etsu_email || user?.email || "",
        first_name: user?.first_name || "",
        last_name: user?.last_name || "",
        fullname: user?.fullname || "", // Added for Supervisor
        speciality: user?.speciality || "", // Added for Supervisor
        role: user?.role || "",
        department: user?.department || "",
        major: user?.major || "",
        password: user?.password || "••••••••",
      });
    }
  }, [user]);

  if (!user) return null;

  // 2. Check if this object is a supervisor by looking for their unique fields
  const isSupervisor = Boolean(user.fullname || user.speciality);

  return (
    <Overlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <Header>
          <HeaderTextWrap>
            {/* 3. Dynamically change the title */}
            <Title>
              {isSupervisor ? "View Supervisor Details" : "View User Details"}
            </Title>
            <Subtitle>
              View the selected {isSupervisor ? "supervisor's" : "user's"}{" "}
              information.
            </Subtitle>
          </HeaderTextWrap>

          <CloseButton type="button" onClick={onClose}>
            ×
          </CloseButton>
        </Header>

        <FormBody>
          <Form>
            {/* 4. Conditional Rendering: Show Supervisor fields OR User fields */}
            {isSupervisor ? (
              // --- SUPERVISOR LAYOUT ---
              <>
                <Field>
                  <Label>Full Name</Label>
                  <Input type="text" value={form.fullname} disabled readOnly />
                </Field>

                <Field>
                  <Label>Speciality</Label>
                  <Input
                    type="text"
                    value={form.speciality}
                    disabled
                    readOnly
                  />
                </Field>

                {/* If your backend ever adds emails to supervisors, it will show up here automatically! */}
                {form.etsu_email && (
                  <Field>
                    <Label>ETSU Email</Label>
                    <Input
                      type="email"
                      value={form.etsu_email}
                      disabled
                      readOnly
                    />
                  </Field>
                )}
              </>
            ) : (
              // --- REGULAR USER LAYOUT ---
              <>
                <TwoCol>
                  <Field>
                    <Label>First Name</Label>
                    <Input
                      type="text"
                      name="first_name"
                      value={form.first_name}
                      disabled
                      readOnly
                    />
                  </Field>

                  <Field>
                    <Label>Last Name</Label>
                    <Input
                      type="text"
                      name="last_name"
                      value={form.last_name}
                      disabled
                      readOnly
                    />
                  </Field>
                </TwoCol>

                <Field>
                  <Label>ETSU Email</Label>
                  <Input
                    type="email"
                    name="etsu_email"
                    value={form.etsu_email}
                    disabled
                    readOnly
                  />
                </Field>

                <Field>
                  <Label>Password</Label>
                  <Input
                    type="text"
                    name="password"
                    value={form.password}
                    disabled
                    readOnly
                  />
                </Field>

                <TwoCol>
                  <Field>
                    <Label>Role</Label>
                    <Select name="role" value={form.role} disabled>
                      <option value="">Select role</option>
                      {roles.map((role) => (
                        <option key={role} value={role}>
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </option>
                      ))}
                    </Select>
                  </Field>

                  <Field>
                    <Label>Programs</Label>
                    <Select name="program" value={form.department} disabled>
                      <option value="">Select program</option>
                      {programs.map((dept) => (
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
                    disabled
                    readOnly
                  />
                </Field>
              </>
            )}

            <ButtonRow>
              <CloseActionButton type="button" onClick={onClose}>
                Close
              </CloseActionButton>
            </ButtonRow>
          </Form>
        </FormBody>
      </ModalCard>
    </Overlay>
  );
};

export default ViewUserModal;
