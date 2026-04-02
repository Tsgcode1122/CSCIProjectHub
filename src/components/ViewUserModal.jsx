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
  const [form, setForm] = useState({
    etsu_email: "",
    first_name: "",
    last_name: "",
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
        role: user?.role || "",
        department: user?.department || "",
        major: user?.major || "",
        password: user?.password || "••••••••",
      });
    }
  }, [user]);

  if (!user) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <Header>
          <HeaderTextWrap>
            <Title>View User Details</Title>
            <Subtitle>View the selected user's information.</Subtitle>
          </HeaderTextWrap>

          <CloseButton type="button" onClick={onClose}>
            ×
          </CloseButton>
        </Header>

        <FormBody>
          <Form>
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
