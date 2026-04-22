import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaSave, FaTimes } from "react-icons/fa";
import { ETSU_NAVY, BORDER, MUTED } from "../dashboardStyles";
import { useAdminAuth } from "../AdminAuthContext";
import {
  SuccessTitle,
  SuccessIcon,
  SuccessCard,
  SuccessOverlay,
  SuccessText,
} from "../../components/ModalStyles";
import {
  formatToMonthYear,
  parseToMonthInput,
} from "../components/dateHelpers";
const API_BASE = "https://csciprojecthub.etsu.edu/api";
import SupervisorSelect from "../components/SupervisorSelect";
import FormSelect from "../components/FormSelect";
const statusOptions = [
  { value: "In Progress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
];
const departmentOptions = [
  { value: "Computer Science", label: "Computer Science" },
  { value: "Information Systems", label: "Information Systems" },
  { value: "Information Technology", label: "Information Technology" },
  { value: "Data Science", label: "Data Science" },
  { value: "Cybersecurity", label: "Cybersecurity" },
];
export default function CreateThesisForm({ saving, onCancel, onSubmit }) {
  const [successOpen, setSuccessOpen] = useState(false);
  const navigate = useNavigate();
  const { adminUser } = useAdminAuth();

  const [saveError, setSaveError] = useState("");

  const [form, setForm] = useState({
    title: "",
    overview: "",
    methodology: "",
    key_findings: "",
    publications: [],
    future_work: "",
    student: "",
    supervisor: "",
    department: "",
    status: "Draft",
    tags: [],
    short_description: "",
    duration_start: "",
    duration_end: "",
  });

  const [inputs, setInputs] = useState({
    tags: "",
    publications_title: "",
    publications_link: "",
    publications_date: "",
  });

  const canSubmit = useMemo(() => {
    return (
      form.title.trim() &&
      form.overview.trim() &&
      form.student.trim() &&
      form.supervisor.trim() &&
      form.department.trim()
    );
  }, [form]);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateInput(key, value) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  function addTag() {
    const value = inputs.tags.trim();
    if (!value) return;

    setForm((prev) => {
      const exists = prev.tags.some(
        (item) => String(item).toLowerCase() === value.toLowerCase(),
      );
      if (exists) return prev;
      return { ...prev, tags: [...prev.tags, value] };
    });

    updateInput("tags", "");
  }

  function removeTag(index) {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  }

  function addPublication() {
    const title = inputs.publications_title.trim();
    const link = inputs.publications_link.trim();
    const published_on = inputs.publications_date.trim();

    if (!title) return;

    setForm((prev) => ({
      ...prev,
      publications: [...prev.publications, { title, link, published_on }],
    }));

    updateInput("publications_title", "");
    updateInput("publications_link", "");
    updateInput("publications_date", "");
  }

  function removePublication(index) {
    setForm((prev) => ({
      ...prev,
      publications: prev.publications.filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      title: form.title.trim(),
      overview: form.overview.trim(),
      methodology: form.methodology.trim(),
      key_findings: form.key_findings.trim(),
      publications: form.publications,
      future_work: form.future_work.trim(),
      student: form.student.trim(),
      supervisor: form.supervisor,
      department: form.department,
      status: form.status,
      tags: form.tags,
      short_description: form.short_description.trim(),
      duration_start: formatToMonthYear(form.duration_start),
      duration_end: formatToMonthYear(form.duration_end),
    };

    try {
      const success = await onSubmit?.(payload);
      if (success) {
        setSuccessOpen(true);
        setTimeout(() => {
          setSuccessOpen(false);
          onCancel?.();
        }, 2500);
      }
    } catch (err) {
      console.error("Thesis creation failed", err);
    }
  }

  return (
    <>
      <Form onSubmit={handleSubmit}>
        {saveError ? <ErrorBanner>{saveError}</ErrorBanner> : null}

        <Section>
          <SectionTitle>Basic Information</SectionTitle>

          <Field>
            <Label>Title *</Label>
            <Input
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
            />
          </Field>

          <Field>
            <Label>Short Description</Label>
            <Input
              value={form.short_description}
              onChange={(e) => updateField("short_description", e.target.value)}
            />
          </Field>

          <Grid2>
            <Field>
              <Label>Student *</Label>
              <Input
                value={form.student}
                onChange={(e) => updateField("student", e.target.value)}
              />
            </Field>

            <Field>
              <Label>Supervisor *</Label>
              <SupervisorSelect
                value={form.supervisor}
                onChange={(val) => updateField("supervisor", val)}
              />
            </Field>
          </Grid2>

          <Grid2>
            <Field>
              <Label>Discipline *</Label>
              <FormSelect
                options={departmentOptions}
                value={form.department}
                onChange={(val) => updateField("department", val)}
                placeholder="Select Discipline..."
              />
            </Field>

            <Field>
              <Label>Status</Label>
              <FormSelect
                options={statusOptions}
                value={form.status}
                onChange={(val) => updateField("status", val)}
                placeholder="Select Status..."
              />
            </Field>
          </Grid2>

          <Field>
            <Label>Overview *</Label>
            <TextArea
              rows={6}
              value={form.overview}
              onChange={(e) => updateField("overview", e.target.value)}
            />
          </Field>
        </Section>

        <Section>
          <SectionTitle>Research Content</SectionTitle>

          <Field>
            <Label>Methodology</Label>
            <TextArea
              rows={5}
              value={form.methodology}
              onChange={(e) => updateField("methodology", e.target.value)}
            />
          </Field>

          <Field>
            <Label>Key Findings</Label>
            <TextArea
              rows={5}
              value={form.key_findings}
              onChange={(e) => updateField("key_findings", e.target.value)}
            />
          </Field>

          <Field>
            <Label>Future Work</Label>
            <TextArea
              rows={5}
              value={form.future_work}
              onChange={(e) => updateField("future_work", e.target.value)}
            />
          </Field>
        </Section>

        <Section>
          <SectionTitle>Timeline & Tags</SectionTitle>

          <Grid2>
            <Field>
              <Label>Duration Start</Label>
              <Input
                type="month"
                value={form.duration_start}
                onChange={(e) => updateField("duration_start", e.target.value)}
              />
            </Field>

            <Field>
              <Label>Duration End</Label>
              <Input
                type="month"
                value={form.duration_end}
                onChange={(e) => updateField("duration_end", e.target.value)}
              />
            </Field>
          </Grid2>

          <ListCard>
            <ListTitle>Tags</ListTitle>
            <AddRow>
              <Input
                value={inputs.tags}
                onChange={(e) => updateInput("tags", e.target.value)}
                placeholder="Add tag"
              />
              <MiniButton type="button" onClick={addTag}>
                <FaPlus />
              </MiniButton>
            </AddRow>

            <ChipWrap>
              {form.tags.map((item, index) => (
                <Chip key={`${item}-${index}`}>
                  {item}
                  <ChipRemove type="button" onClick={() => removeTag(index)}>
                    ×
                  </ChipRemove>
                </Chip>
              ))}
            </ChipWrap>
          </ListCard>
        </Section>

        <Section>
          <SectionTitle>Publications</SectionTitle>

          <ListCard>
            <AddRow3>
              <Input
                value={inputs.publications_title}
                onChange={(e) =>
                  updateInput("publications_title", e.target.value)
                }
                placeholder="Publication title"
              />
              <Input
                value={inputs.publications_link}
                onChange={(e) =>
                  updateInput("publications_link", e.target.value)
                }
                placeholder="Publication link"
              />
            </AddRow3>

            <RightRow>
              <MiniButton type="button" onClick={addPublication}>
                <FaPlus />
                <span>Add Publication</span>
              </MiniButton>
            </RightRow>

            <Stack>
              {form.publications.map((item, index) => (
                <PairCard key={index}>
                  <PairLabel>Title</PairLabel>
                  <PairText>{item.title || "—"}</PairText>

                  <PairLabel>Link</PairLabel>
                  <PairText>{item.link || "—"}</PairText>

                  <PairRemove
                    type="button"
                    onClick={() => removePublication(index)}
                  >
                    Remove
                  </PairRemove>
                </PairCard>
              ))}
            </Stack>
          </ListCard>
        </Section>

        <Footer>
          <GhostButton
            type="button"
            onClick={() => navigate("/admin/projects")}
            disabled={saving}
          >
            <FaTimes />
            <span>Cancel</span>
          </GhostButton>

          <PrimaryButton type="submit" disabled={!canSubmit || saving}>
            <FaSave />
            <span>{saving ? "Creating..." : "Create Thesis"}</span>
          </PrimaryButton>
        </Footer>
      </Form>
      {successOpen && (
        <SuccessOverlay>
          <SuccessCard>
            <SuccessIcon>✓</SuccessIcon>
            <SuccessTitle>Thesis Created</SuccessTitle>
            <SuccessText>
              "{form.title}" has been successfully added to the repository.
            </SuccessText>
          </SuccessCard>
        </SuccessOverlay>
      )}
    </>
  );
}

const Form = styled.form``;

const Section = styled.section`
  border: 1px solid ${BORDER};
  border-radius: 18px;
  padding: 18px;
  margin-top: 18px;
  background: #fcfdff;
`;

const SectionTitle = styled.h3`
  margin: 0 0 16px;
  color: ${ETSU_NAVY};
  font-size: 18px;
`;

const Grid2 = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.div`
  display: grid;
  gap: 8px;
  margin-bottom: 16px;
`;

const Label = styled.label`
  color: ${ETSU_NAVY};
  font-size: 14px;
  font-weight: 700;
`;

const Input = styled.input`
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  border: 1px solid ${BORDER};
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 14px;
  outline: none;
  background: white;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  border: 1px solid ${BORDER};
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 14px;
  resize: vertical;
  outline: none;
  background: white;
`;

const ListCard = styled.div`
  border: 1px solid ${BORDER};
  border-radius: 16px;
  background: white;
  padding: 16px;
  margin-top: 14px;
`;

const ListTitle = styled.h4`
  margin: 0 0 12px;
  color: ${ETSU_NAVY};
  font-size: 15px;
`;

const AddRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 54px;
  gap: 10px;
  margin-bottom: 12px;
`;

const AddRow3 = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 12px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const RightRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12px;
`;

const MiniButton = styled.button`
  border: 1px solid ${BORDER};
  background: white;
  color: ${ETSU_NAVY};
  border-radius: 12px;
  padding: 10px 12px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
`;

const ChipWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Chip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 999px;
  padding: 8px 12px;
  background: #eef2f7;
  color: ${ETSU_NAVY};
  font-size: 13px;
  font-weight: 600;
`;

const ChipRemove = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  color: ${ETSU_NAVY};
  font-weight: 900;
`;

const Stack = styled.div`
  display: grid;
  gap: 12px;
`;

const PairCard = styled.div`
  border: 1px solid ${BORDER};
  border-radius: 14px;
  padding: 14px;
  background: #fafcff;
`;

const PairLabel = styled.div`
  font-size: 12px;
  font-weight: 800;
  color: ${MUTED};
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 4px;
`;

const PairText = styled.div`
  color: ${ETSU_NAVY};
  margin-bottom: 10px;
  word-break: break-word;
`;

const PairRemove = styled.button`
  border: none;
  background: transparent;
  color: #b91c1c;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 18px;
`;

const GhostButton = styled.button`
  border: 1px solid ${BORDER};
  background: white;
  color: ${ETSU_NAVY};
  border-radius: 12px;
  padding: 12px 16px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled.button`
  border: none;
  background: ${ETSU_NAVY};
  color: white;
  border-radius: 12px;
  padding: 12px 16px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

const ErrorBanner = styled.div`
  margin-top: 16px;
  border: 1px solid #fecaca;
  background: #fef2f2;
  color: #b91c1c;
  border-radius: 12px;
  padding: 12px 14px;
`;
