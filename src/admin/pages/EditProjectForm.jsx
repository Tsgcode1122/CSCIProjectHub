import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { FaPlus, FaSave, FaTimes } from "react-icons/fa";
import { ETSU_NAVY, BORDER, MUTED } from "../dashboardStyles";
import { useProjectContext } from "../../context/ProjectContext";
import CreateUserModal from "../../components/CreateUser";
import ReactSelect from "react-select";
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
function safeArray(value) {
  return Array.isArray(value) ? value : [];
}
const statusOptions = [
  { value: "Accepting Members", label: "Accepting Members" },
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
const API_BASE = "https://crpp-project.onrender.com";
const STORAGE_KEY = "capstone_admin_session";
export default function EditProjectForm({
  initialData,
  saving,
  onCancel,
  onSubmit,
}) {
  const [form, setForm] = useState({
    title: initialData.title ?? "",
    overview: initialData.overview ?? "",
    short_description: initialData.short_description ?? "",
    supervisor: initialData.supervisor ?? "",
    department: initialData.department ?? "",
    project_status: initialData.project_status ?? "",
    status: initialData.status ?? "",
    // accepting_members: Boolean(initialData.accepting_members),
    project_link: initialData.project_link ?? "",
    sourcecode_link: initialData.sourcecode_link ?? "",
    // thumbnail_url: initialData.thumbnail_url ?? "",
    duration_start: parseToMonthInput(initialData.duration_start),
    duration_end: parseToMonthInput(initialData.duration_end),
    team_members: safeArray(initialData.team_members),
    tags: safeArray(initialData.tags),
    tech_stack: safeArray(initialData.tech_stack),
    key_features: safeArray(initialData.key_features),
    achievements: safeArray(initialData.achievements),
    challenges_solutions: safeArray(initialData.challenges_solutions),
  });
  const { projects, loading, error } = useProjectContext();
  const [successOpen, setSuccessOpen] = useState(false);
  const [inputs, setInputs] = useState({
    team_members: "",
    tags: "",
    tech_stack: "",
    key_features: "",
    achievements: "",
    challenge: "",
    solution: "",
  });
  // --- NEW SUPERVISOR LOGIC ---
  const [apiSupervisors, setApiSupervisors] = useState([]);
  const [showAddSupervisor, setShowAddSupervisor] = useState(false);

  const fetchSupervisors = async () => {
    try {
      const storedSession = sessionStorage.getItem(STORAGE_KEY);
      const token = storedSession
        ? JSON.parse(storedSession)?.access_token
        : null;
      if (!token) return;

      const res = await fetch(`${API_BASE}/supervisors/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        const sorted = (Array.isArray(data) ? data : []).sort((a, b) =>
          (a.fullname || "").localeCompare(b.fullname || ""),
        );
        setApiSupervisors(sorted);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSupervisors();
  }, []);

  // 1. Format options for React-Select
  const supervisorOptions = apiSupervisors.map((sup) => ({
    value: sup.fullname,
    label: sup.fullname,
  }));

  // Append our brightly styled custom option at the bottom
  supervisorOptions.push({
    value: "ADD_NEW",
    label: "➕ Not in database? Add new supervisor",
    isCustomAction: true, // We use this flag to style it differently!
  });

  // 2. Add custom CSS styles for the dropdown
  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      borderRadius: "12px",
      borderColor: "#e2e8f0", // Matches your standard BORDER color
      padding: "2px",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#cbd5e1",
      },
    }),
    option: (provided, state) => {
      // If this is our custom "Add New" option, make it bright blue!
      if (state.data.isCustomAction) {
        return {
          ...provided,
          color: "#3B82F6",
          fontWeight: "800",
          backgroundColor: state.isFocused ? "#eff6ff" : "white",
          cursor: "pointer",
          borderTop: "1px solid #e2e8f0", // Adds a nice divider line above it
        };
      }

      // Standard options
      return {
        ...provided,
        color: ETSU_NAVY,
        backgroundColor: state.isSelected
          ? "#eef2f7"
          : state.isFocused
            ? "#f8fafc"
            : "white",
        cursor: "pointer",
      };
    },
  };

  // 3. Update the change handler (React-Select passes an object, not an event)
  const handleSupervisorChange = (selectedOption) => {
    if (!selectedOption) {
      updateField("supervisor", "");
      return;
    }

    if (selectedOption.value === "ADD_NEW") {
      setShowAddSupervisor(true);
    } else {
      updateField("supervisor", selectedOption.value);
    }
  };

  const handleSupervisorAdded = (newSupervisor) => {
    setShowAddSupervisor(false);
    fetchSupervisors();
    if (newSupervisor?.fullname)
      updateField("supervisor", newSupervisor.fullname);
  };
  // ----------------------------
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
        (item) => String(item).toLowerCase() === value.toLowerCase(),
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
        (_, i) => i !== index,
      ),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
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

      department: form.department.trim(),
      project_status: form.project_status.trim(),

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
          onCancel?.(); // Redirects back to dashboard
        }, 2200);
      }
    } catch (err) {
      console.error("Failed to update thesis", err);
    }
  }

  return (
    <>
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
            <TextArea
              rows={3}
              value={form.short_description}
              onChange={(e) => updateField("short_description", e.target.value)}
            />
          </Field>

          <Grid2>
            <Field>
              <Label>Supervisor *</Label>
              <ReactSelect
                options={supervisorOptions}
                styles={customSelectStyles}
                onChange={handleSupervisorChange}
                // React-Select needs the full object to display the current value
                value={
                  supervisorOptions.find(
                    (opt) => opt.value === form.supervisor,
                  ) || null
                }
                placeholder="Select a supervisor..."
                isClearable={true} // Adds a nice little 'x' to clear the field!
              />
            </Field>

            <Field>
              <Label>Department *</Label>
              <ReactSelect
                options={departmentOptions}
                styles={customSelectStyles} // Keeps it perfectly matching!
                onChange={(selectedOption) => {
                  updateField(
                    "department",
                    selectedOption ? selectedOption.value : "",
                  );
                }}
                value={
                  departmentOptions.find(
                    (opt) => opt.value === form.department,
                  ) || null
                }
                placeholder="Select a department..."
                isClearable={true}
              />
            </Field>
          </Grid2>

          <Grid2>
            <Field>
              <Label>Project Status</Label>
              <ReactSelect
                options={statusOptions}
                styles={customSelectStyles} // Reusing your beautiful custom styles!
                // react-select passes the object, not an event (e)
                onChange={(selectedOption) => {
                  updateField(
                    "project_status",
                    selectedOption ? selectedOption.value : "",
                  );
                }}
                // Match the string in your form state back to the object array
                value={
                  statusOptions.find(
                    (opt) => opt.value === form.project_status,
                  ) || null
                }
                placeholder="Select a status..."
                isClearable={true}
              />
            </Field>
          </Grid2>

          <Field>
            <Label>Overview *</Label>
            <TextArea
              rows={8}
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
            <span>{saving ? "Saving..." : "Save Changes"}</span>
          </PrimaryButton>
        </Footer>
      </Form>
      {showAddSupervisor && (
        <CreateUserModal
          isSupervisor={true}
          onClose={() => setShowAddSupervisor(false)}
          onSuccess={handleSupervisorAdded}
        />
      )}
      {successOpen && (
        <SuccessOverlay>
          <SuccessCard>
            <SuccessIcon>✓</SuccessIcon>
            <SuccessTitle>Changes Saved</SuccessTitle>
            <SuccessText>
              The project record has been updated successfully.
            </SuccessText>
          </SuccessCard>
        </SuccessOverlay>
      )}
    </>
  );
}

const Form = styled.form``;
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
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 18px 0 8px;
  background: linear-gradient(to top, white 78%, rgba(255, 255, 255, 0.75));
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
`;
const AddNewLink = styled.button`
  background: none;
  border: none;
  padding: 0;
  margin-top: -6px; /* Pulls it slightly closer to the dropdown */
  text-align: left;
  font-size: 13px;
  color: ${MUTED};
  cursor: pointer;
  display: flex;
  gap: 4px;
  transition: opacity 0.2s;

  span {
    color: #3b82f6; /* A bright, modern blue */
    font-weight: 700;
  }

  &:hover {
    opacity: 0.8;
  }
`;
