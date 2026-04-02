import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { FaPlus, FaSave, FaTimes } from "react-icons/fa";
import { ETSU_NAVY, BORDER, MUTED } from "../dashboardStyles";

export default function CreateProjectForm({
  saving = false,
  onCancel,
  onSubmit,
}) {
  const [form, setForm] = useState({
    title: "",
    overview: "",
    short_description: "",
    supervisor: "",
    department: "",
    project_status: "",
    status: "pending",
    accepting_members: false,
    project_link: "",
    sourcecode_link: "",
    thumbnail_url: "",
    duration_start: "",
    duration_end: "",
    team_members: [],
    tags: [],
    tech_stack: [],
    key_features: [],
    achievements: [],
    challenges_solutions: [],
  });

  const [inputs, setInputs] = useState({
    team_members: "",
    tags: "",
    tech_stack: "",
    key_features: "",
    achievements: "",
    challenge: "",
    solution: "",
  });

  const canSubmit = useMemo(() => {
    return (
      form.title.trim() &&
      form.overview.trim() &&
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

  function addUniqueItem(listKey, inputKey) {
    const value = inputs[inputKey].trim();
    if (!value) return;

    setForm((prev) => {
      const exists = prev[listKey].some(
        (item) => String(item).toLowerCase() === value.toLowerCase()
      );
      if (exists) return prev;
      return { ...prev, [listKey]: [...prev[listKey], value] };
    });

    updateInput(inputKey, "");
  }

  function removeListItem(listKey, index) {
    setForm((prev) => ({
      ...prev,
      [listKey]: prev[listKey].filter((_, i) => i !== index),
    }));
  }

  function addChallengeSolution() {
    const challenge = inputs.challenge.trim();
    const solution = inputs.solution.trim();
    if (!challenge || !solution) return;

    setForm((prev) => ({
      ...prev,
      challenges_solutions: [
        ...prev.challenges_solutions,
        { challenge, solution },
      ],
    }));

    updateInput("challenge", "");
    updateInput("solution", "");
  }

  function removeChallengeSolution(index) {
    setForm((prev) => ({
      ...prev,
      challenges_solutions: prev.challenges_solutions.filter(
        (_, i) => i !== index
      ),
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    onSubmit?.({
      title: form.title.trim(),
      overview: form.overview.trim(),
      key_features: form.key_features,
      challenges_solutions: form.challenges_solutions,
      team_members: form.team_members,
      supervisor: form.supervisor.trim(),
      project_link: form.project_link.trim(),
      sourcecode_link: form.sourcecode_link.trim(),
      tech_stack: form.tech_stack,
      achievements: form.achievements,
      status: form.status.trim() || "pending",
      department: form.department.trim(),
      project_status: form.project_status.trim(),
      accepting_members: form.accepting_members,
      tags: form.tags,
      thumbnail_url: form.thumbnail_url.trim(),
      short_description: form.short_description.trim(),
      duration_start: form.duration_start.trim(),
      duration_end: form.duration_end.trim(),
    });
  }

  return (
    <Form onSubmit={handleSubmit}>
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
            <Label>Supervisor *</Label>
            <Input
              value={form.supervisor}
              onChange={(e) => updateField("supervisor", e.target.value)}
            />
          </Field>

          <Field>
            <Label>Department *</Label>
            <Input
              value={form.department}
              onChange={(e) => updateField("department", e.target.value)}
            />
          </Field>
        </Grid2>

        <Grid2>
          {/* <Field>
            <Label>Status</Label>
            <Input
              value={form.status}
              onChange={(e) => updateField("status", e.target.value)}
              placeholder="pending"
            />
          </Field> */}

          <Field>
            <Label>Status</Label>
            <Select
                value={form.status}
                onChange={(e) => updateField("status", e.target.value)}
            >
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
            </Select>
          </Field>

          {/* <Field>
            <Label>Project Status</Label>
            <Input
              value={form.project_status}
              onChange={(e) => updateField("project_status", e.target.value)}
            />
          </Field> */}

          <Field>
            <Label>Project Status</Label>
                <Select
                    value={form.project_status}
                    onChange={(e) => updateField("project_status", e.target.value)}
                >
                    <option value="">Select status</option>
                    <option value="planning">Planning</option>
                    <option value="in progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="on hold">On Hold</option>
                </Select>
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
        <SectionTitle>Links & Timeline</SectionTitle>

        <Grid2>
          <Field>
            <Label>Project Link</Label>
            <Input
              value={form.project_link}
              onChange={(e) => updateField("project_link", e.target.value)}
            />
          </Field>

          <Field>
            <Label>Source Code Link</Label>
            <Input
              value={form.sourcecode_link}
              onChange={(e) => updateField("sourcecode_link", e.target.value)}
            />
          </Field>
        </Grid2>

        <Field>
          <Label>Thumbnail URL</Label>
          <Input
            value={form.thumbnail_url}
            onChange={(e) => updateField("thumbnail_url", e.target.value)}
          />
        </Field>

        <Grid2>
          <Field>
            <Label>Duration Start</Label>
            <Input
              value={form.duration_start}
              onChange={(e) => updateField("duration_start", e.target.value)}
            />
          </Field>

          <Field>
            <Label>Duration End</Label>
            <Input
              value={form.duration_end}
              onChange={(e) => updateField("duration_end", e.target.value)}
            />
          </Field>
        </Grid2>

        <CheckboxRow>
          <input
            id="accepting_members"
            type="checkbox"
            checked={form.accepting_members}
            onChange={(e) => updateField("accepting_members", e.target.checked)}
          />
          <CheckboxLabel htmlFor="accepting_members">
            Accepting Members
          </CheckboxLabel>
        </CheckboxRow>
      </Section>

      <Section>
        <SectionTitle>Project Lists</SectionTitle>

        <ListCard>
          <ListTitle>Team Members</ListTitle>
          <AddRow>
            <Input
              value={inputs.team_members}
              onChange={(e) => updateInput("team_members", e.target.value)}
              placeholder="Add team member"
            />
            <MiniButton
              type="button"
              onClick={() => addUniqueItem("team_members", "team_members")}
            >
              <FaPlus />
            </MiniButton>
          </AddRow>
          <ChipWrap>
            {form.team_members.map((item, index) => (
              <Chip key={`${item}-${index}`}>
                {item}
                <ChipRemove
                  type="button"
                  onClick={() => removeListItem("team_members", index)}
                >
                  ×
                </ChipRemove>
              </Chip>
            ))}
          </ChipWrap>
        </ListCard>

        <ListCard>
          <ListTitle>Tags</ListTitle>
          <AddRow>
            <Input
              value={inputs.tags}
              onChange={(e) => updateInput("tags", e.target.value)}
              placeholder="Add tag"
            />
            <MiniButton
              type="button"
              onClick={() => addUniqueItem("tags", "tags")}
            >
              <FaPlus />
            </MiniButton>
          </AddRow>
          <ChipWrap>
            {form.tags.map((item, index) => (
              <Chip key={`${item}-${index}`}>
                {item}
                <ChipRemove
                  type="button"
                  onClick={() => removeListItem("tags", index)}
                >
                  ×
                </ChipRemove>
              </Chip>
            ))}
          </ChipWrap>
        </ListCard>

        <ListCard>
          <ListTitle>Tech Stack</ListTitle>
          <AddRow>
            <Input
              value={inputs.tech_stack}
              onChange={(e) => updateInput("tech_stack", e.target.value)}
              placeholder="Add tech stack item"
            />
            <MiniButton
              type="button"
              onClick={() => addUniqueItem("tech_stack", "tech_stack")}
            >
              <FaPlus />
            </MiniButton>
          </AddRow>
          <ChipWrap>
            {form.tech_stack.map((item, index) => (
              <Chip key={`${item}-${index}`}>
                {item}
                <ChipRemove
                  type="button"
                  onClick={() => removeListItem("tech_stack", index)}
                >
                  ×
                </ChipRemove>
              </Chip>
            ))}
          </ChipWrap>
        </ListCard>

        <ListCard>
          <ListTitle>Key Features</ListTitle>
          <AddRow>
            <Input
              value={inputs.key_features}
              onChange={(e) => updateInput("key_features", e.target.value)}
              placeholder="Add key feature"
            />
            <MiniButton
              type="button"
              onClick={() => addUniqueItem("key_features", "key_features")}
            >
              <FaPlus />
            </MiniButton>
          </AddRow>
          <ChipWrap>
            {form.key_features.map((item, index) => (
              <Chip key={`${item}-${index}`}>
                {item}
                <ChipRemove
                  type="button"
                  onClick={() => removeListItem("key_features", index)}
                >
                  ×
                </ChipRemove>
              </Chip>
            ))}
          </ChipWrap>
        </ListCard>

        <ListCard>
          <ListTitle>Achievements</ListTitle>
          <AddRow>
            <Input
              value={inputs.achievements}
              onChange={(e) => updateInput("achievements", e.target.value)}
              placeholder="Add achievement"
            />
            <MiniButton
              type="button"
              onClick={() => addUniqueItem("achievements", "achievements")}
            >
              <FaPlus />
            </MiniButton>
          </AddRow>
          <ChipWrap>
            {form.achievements.map((item, index) => (
              <Chip key={`${item}-${index}`}>
                {item}
                <ChipRemove
                  type="button"
                  onClick={() => removeListItem("achievements", index)}
                >
                  ×
                </ChipRemove>
              </Chip>
            ))}
          </ChipWrap>
        </ListCard>

        <ListCard>
          <ListTitle>Challenges & Solutions</ListTitle>

          <Grid2>
            <Field>
              <Label>Challenge</Label>
              <Input
                value={inputs.challenge}
                onChange={(e) => updateInput("challenge", e.target.value)}
              />
            </Field>

            <Field>
              <Label>Solution</Label>
              <Input
                value={inputs.solution}
                onChange={(e) => updateInput("solution", e.target.value)}
              />
            </Field>
          </Grid2>

          <RightRow>
            <MiniButton type="button" onClick={addChallengeSolution}>
              <FaPlus />
              <span>Add Pair</span>
            </MiniButton>
          </RightRow>

          <Stack>
            {form.challenges_solutions.map((item, index) => (
              <PairCard key={index}>
                <PairLabel>Challenge</PairLabel>
                <PairText>{item.challenge}</PairText>

                <PairLabel>Solution</PairLabel>
                <PairText>{item.solution}</PairText>

                <PairRemove
                  type="button"
                  onClick={() => removeChallengeSolution(index)}
                >
                  Remove
                </PairRemove>
              </PairCard>
            ))}
          </Stack>
        </ListCard>
      </Section>

      <Footer>
        <GhostButton type="button" onClick={onCancel} disabled={saving}>
          <FaTimes />
          <span>Cancel</span>
        </GhostButton>

        <PrimaryButton type="submit" disabled={!canSubmit || saving}>
          <FaSave />
          <span>{saving ? "Creating..." : "Create Project"}</span>
        </PrimaryButton>
      </Footer>
    </Form>
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

const CheckboxRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CheckboxLabel = styled.label`
  color: ${ETSU_NAVY};
  font-weight: 600;
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

const Select = styled.select`
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  border: 1px solid ${BORDER};
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 14px;
  outline: none;
  background: white;
  cursor: pointer;
`;