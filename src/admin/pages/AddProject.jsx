// import React, { useMemo, useState } from "react";
// import styled from "styled-components";
// import { useNavigate } from "react-router-dom";
// import { useAdminAuth } from "../AdminAuthContext";
// import { ETSU_NAVY, BORDER, MUTED } from "../dashboardStyles";

// const API_BASE = "https://crpp-project.onrender.com";

// export default function AddProject() {
//   const navigate = useNavigate();
//   const { adminUser } = useAdminAuth();

//   const [form, setForm] = useState({
//     title: "",
//     overview: "",
//     short_description: "",
//     supervisor: "",
//     department: "",
//     project_status: "",
//     status: "pending",
//     accepting_members: false,
//     project_link: "",
//     sourcecode_link: "",
//     thumbnail_url: "",
//     duration_start: "",
//     duration_end: "",

//     team_members_input: "",
//     team_members: [],

//     tags_input: "",
//     tags: [],

//     tech_stack_input: "",
//     tech_stack: [],

//     key_features_input: "",
//     key_features: [],

//     achievements_input: "",
//     achievements: [],

//     challenge: "",
//     solution: "",
//     challenges_solutions: [],
//   });

//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [successMsg, setSuccessMsg] = useState("");

//   const canSubmit = useMemo(() => {
//     return (
//       form.title.trim() &&
//       form.overview.trim() &&
//       form.supervisor.trim() &&
//       form.department.trim()
//     );
//   }, [form]);

//   function updateField(name, value) {
//     setForm((prev) => ({ ...prev, [name]: value }));
//   }

//   function addListItem(inputKey, listKey) {
//     const value = form[inputKey].trim();
//     if (!value) return;

//     setForm((prev) => ({
//       ...prev,
//       [listKey]: [...prev[listKey], value],
//       [inputKey]: "",
//     }));
//   }

//   function removeListItem(listKey, index) {
//     setForm((prev) => ({
//       ...prev,
//       [listKey]: prev[listKey].filter((_, i) => i !== index),
//     }));
//   }

//   function addChallengeSolution() {
//     const challenge = form.challenge.trim();
//     const solution = form.solution.trim();
//     if (!challenge || !solution) return;

//     setForm((prev) => ({
//       ...prev,
//       challenges_solutions: [
//         ...prev.challenges_solutions,
//         { challenge, solution },
//       ],
//       challenge: "",
//       solution: "",
//     }));
//   }

//   function removeChallengeSolution(index) {
//     setForm((prev) => ({
//       ...prev,
//       challenges_solutions: prev.challenges_solutions.filter((_, i) => i !== index),
//     }));
//   }

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setError("");
//     setSuccessMsg("");

//     if (!canSubmit) {
//       setError("Please fill in all required fields.");
//       return;
//     }

//     const payload = {
//       title: form.title.trim(),
//       overview: form.overview.trim(),
//       key_features: form.key_features,
//       challenges_solutions: form.challenges_solutions,
//       team_members: form.team_members,
//       supervisor: form.supervisor.trim(),
//       project_link: form.project_link.trim(),
//       sourcecode_link: form.sourcecode_link.trim(),
//       tech_stack: form.tech_stack,
//       achievements: form.achievements,
//       status: form.status,
//       department: form.department.trim(),
//       project_status: form.project_status.trim(),
//       accepting_members: form.accepting_members,
//       tags: form.tags,
//       thumbnail_url: form.thumbnail_url.trim(),
//       short_description: form.short_description.trim(),
//       duration_start: form.duration_start.trim(),
//       duration_end: form.duration_end.trim(),
//     };

//     try {
//       setSaving(true);

//       const res = await fetch(`${API_BASE}/projects/`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//           ...(adminUser?.access_token
//             ? { Authorization: `Bearer ${adminUser.access_token}` }
//             : {}),
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const errData = await res.json().catch(() => null);
//         const msg =
//           errData?.detail
//             ? Array.isArray(errData.detail)
//               ? errData.detail.map((d) => d.msg).join(", ")
//               : String(errData.detail)
//             : `Create project failed (${res.status})`;
//         throw new Error(msg);
//       }

//       await res.json();
//       setSuccessMsg("Project created successfully.");
//       setTimeout(() => navigate("/admin/projects"), 800);
//     } catch (err) {
//       setError(err.message || "Something went wrong.");
//     } finally {
//       setSaving(false);
//     }
//   }

//   return (
//     <Page>
//       <Card as="form" onSubmit={handleSubmit}>
//         <Title>Create New Project</Title>
//         <Subtitle>Fill in the details below to add a new entry</Subtitle>

//         {error ? <ErrorBox>{error}</ErrorBox> : null}
//         {successMsg ? <SuccessBox>{successMsg}</SuccessBox> : null}

//         <Grid2>
//           <Field>
//             <Label>Status</Label>
//             <Select
//               value={form.status}
//               onChange={(e) => updateField("status", e.target.value)}
//             >
//               <option value="pending">pending</option>
//               <option value="Active">Active</option>
//               <option value="Completed">Completed</option>
//             </Select>
//           </Field>

//           <Field>
//             <Label>Project Status</Label>
//             <Input
//               placeholder="In Progress"
//               value={form.project_status}
//               onChange={(e) => updateField("project_status", e.target.value)}
//             />
//           </Field>
//         </Grid2>

//         <Field>
//           <Label>Title *</Label>
//           <Input
//             placeholder="Enter title"
//             value={form.title}
//             onChange={(e) => updateField("title", e.target.value)}
//           />
//         </Field>

//         <Field>
//           <Label>Short Description</Label>
//           <Input
//             placeholder="Short card/list description"
//             value={form.short_description}
//             onChange={(e) => updateField("short_description", e.target.value)}
//           />
//         </Field>

//         <Grid2>
//           <Field>
//             <Label>Supervisor *</Label>
//             <Input
//               placeholder="Dr. Jane Smith"
//               value={form.supervisor}
//               onChange={(e) => updateField("supervisor", e.target.value)}
//             />
//           </Field>

//           <Field>
//             <Label>Department *</Label>
//             <Input
//               placeholder="Computer Science"
//               value={form.department}
//               onChange={(e) => updateField("department", e.target.value)}
//             />
//           </Field>
//         </Grid2>

//         <Field>
//           <Label>Overview *</Label>
//           <TextArea
//             rows={5}
//             placeholder="Enter project overview"
//             value={form.overview}
//             onChange={(e) => updateField("overview", e.target.value)}
//           />
//         </Field>

//         <Grid2>
//           <Field>
//             <Label>Duration Start</Label>
//             <Input
//               placeholder="Jan 2026"
//               value={form.duration_start}
//               onChange={(e) => updateField("duration_start", e.target.value)}
//             />
//           </Field>

//           <Field>
//             <Label>Duration End</Label>
//             <Input
//               placeholder="May 2026"
//               value={form.duration_end}
//               onChange={(e) => updateField("duration_end", e.target.value)}
//             />
//           </Field>
//         </Grid2>

//         <Grid2>
//           <Field>
//             <Label>Project URL</Label>
//             <Input
//               placeholder="https://example.com"
//               value={form.project_link}
//               onChange={(e) => updateField("project_link", e.target.value)}
//             />
//           </Field>

//           <Field>
//             <Label>Source Code URL</Label>
//             <Input
//               placeholder="https://github.com/..."
//               value={form.sourcecode_link}
//               onChange={(e) => updateField("sourcecode_link", e.target.value)}
//             />
//           </Field>
//         </Grid2>

//         <Field>
//           <Label>Thumbnail URL</Label>
//           <Input
//             placeholder="https://image-url.com/thumbnail.png"
//             value={form.thumbnail_url}
//             onChange={(e) => updateField("thumbnail_url", e.target.value)}
//           />
//         </Field>

//         <CheckboxRow>
//           <input
//             id="accepting_members"
//             type="checkbox"
//             checked={form.accepting_members}
//             onChange={(e) => updateField("accepting_members", e.target.checked)}
//           />
//           <CheckboxLabel htmlFor="accepting_members">
//             Accepting Members
//           </CheckboxLabel>
//         </CheckboxRow>

//         <SectionTitle>Team Members</SectionTitle>
//         <AddRow>
//           <Input
//             placeholder="Add member"
//             value={form.team_members_input}
//             onChange={(e) => updateField("team_members_input", e.target.value)}
//           />
//           <MiniButton type="button" onClick={() => addListItem("team_members_input", "team_members")}>
//             Add
//           </MiniButton>
//         </AddRow>
//         <ChipWrap>
//           {form.team_members.map((item, index) => (
//             <Chip key={`${item}-${index}`}>
//               {item}
//               <ChipRemove type="button" onClick={() => removeListItem("team_members", index)}>
//                 ×
//               </ChipRemove>
//             </Chip>
//           ))}
//         </ChipWrap>

//         <SectionTitle>Tags</SectionTitle>
//         <AddRow>
//           <Input
//             placeholder="Add tag"
//             value={form.tags_input}
//             onChange={(e) => updateField("tags_input", e.target.value)}
//           />
//           <MiniButton type="button" onClick={() => addListItem("tags_input", "tags")}>
//             Add
//           </MiniButton>
//         </AddRow>
//         <ChipWrap>
//           {form.tags.map((item, index) => (
//             <Chip key={`${item}-${index}`}>
//               {item}
//               <ChipRemove type="button" onClick={() => removeListItem("tags", index)}>
//                 ×
//               </ChipRemove>
//             </Chip>
//           ))}
//         </ChipWrap>

//         <SectionTitle>Tech Stack</SectionTitle>
//         <AddRow>
//           <Input
//             placeholder="Add tech"
//             value={form.tech_stack_input}
//             onChange={(e) => updateField("tech_stack_input", e.target.value)}
//           />
//           <MiniButton type="button" onClick={() => addListItem("tech_stack_input", "tech_stack")}>
//             Add
//           </MiniButton>
//         </AddRow>
//         <ChipWrap>
//           {form.tech_stack.map((item, index) => (
//             <Chip key={`${item}-${index}`}>
//               {item}
//               <ChipRemove type="button" onClick={() => removeListItem("tech_stack", index)}>
//                 ×
//               </ChipRemove>
//             </Chip>
//           ))}
//         </ChipWrap>

//         <SectionTitle>Key Features</SectionTitle>
//         <AddRow>
//           <Input
//             placeholder="Add feature"
//             value={form.key_features_input}
//             onChange={(e) => updateField("key_features_input", e.target.value)}
//           />
//           <MiniButton type="button" onClick={() => addListItem("key_features_input", "key_features")}>
//             Add
//           </MiniButton>
//         </AddRow>
//         <ChipWrap>
//           {form.key_features.map((item, index) => (
//             <Chip key={`${item}-${index}`}>
//               {item}
//               <ChipRemove type="button" onClick={() => removeListItem("key_features", index)}>
//                 ×
//               </ChipRemove>
//             </Chip>
//           ))}
//         </ChipWrap>

//         <SectionTitle>Achievements</SectionTitle>
//         <AddRow>
//           <Input
//             placeholder="Add achievement"
//             value={form.achievements_input}
//             onChange={(e) => updateField("achievements_input", e.target.value)}
//           />
//           <MiniButton type="button" onClick={() => addListItem("achievements_input", "achievements")}>
//             Add
//           </MiniButton>
//         </AddRow>
//         <ChipWrap>
//           {form.achievements.map((item, index) => (
//             <Chip key={`${item}-${index}`}>
//               {item}
//               <ChipRemove type="button" onClick={() => removeListItem("achievements", index)}>
//                 ×
//               </ChipRemove>
//             </Chip>
//           ))}
//         </ChipWrap>

//         <SectionTitle>Challenges & Solutions</SectionTitle>
//         <Grid2>
//           <Field>
//             <Label>Challenge</Label>
//             <Input
//               placeholder="Enter challenge"
//               value={form.challenge}
//               onChange={(e) => updateField("challenge", e.target.value)}
//             />
//           </Field>

//           <Field>
//             <Label>Solution</Label>
//             <Input
//               placeholder="Enter solution"
//               value={form.solution}
//               onChange={(e) => updateField("solution", e.target.value)}
//             />
//           </Field>
//         </Grid2>

//         <RightRow>
//           <MiniButton type="button" onClick={addChallengeSolution}>
//             Add Challenge/Solution
//           </MiniButton>
//         </RightRow>

//         <ListBlock>
//           {form.challenges_solutions.map((item, index) => (
//             <ListItem key={index}>
//               <strong>Challenge:</strong> {item.challenge}
//               <br />
//               <strong>Solution:</strong> {item.solution}
//               <RemoveTextButton
//                 type="button"
//                 onClick={() => removeChallengeSolution(index)}
//               >
//                 Remove
//               </RemoveTextButton>
//             </ListItem>
//           ))}
//         </ListBlock>

//         <Footer>
//           <SecondaryButton type="button" onClick={() => navigate("/admin/projects")}>
//             Cancel
//           </SecondaryButton>

//           <SubmitButton type="submit" disabled={!canSubmit || saving}>
//             {saving ? "Creating..." : "Create Project"}
//           </SubmitButton>
//         </Footer>
//       </Card>
//     </Page>
//   );
// }

// const Page = styled.div`
//   width: 100%;
//   padding: 10px 0 24px;
// `;

// const Card = styled.div`
//   background: white;
//   border: 1px solid ${BORDER};
//   border-radius: 18px;
//   padding: 24px;
// `;

// const Title = styled.h1`
//   margin: 0;
//   font-size: 20px;
//   color: ${ETSU_NAVY};
// `;

// const Subtitle = styled.p`
//   margin: 8px 0 20px;
//   color: ${MUTED};
// `;

// const Grid2 = styled.div`
//   display: grid;
//   grid-template-columns: 1fr 1fr;
//   gap: 16px;

//   @media (max-width: 900px) {
//     grid-template-columns: 1fr;
//   }
// `;

// const Field = styled.div`
//   display: grid;
//   gap: 8px;
//   margin-bottom: 16px;
// `;

// const Label = styled.label`
//   font-size: 14px;
//   font-weight: 700;
//   color: ${ETSU_NAVY};
// `;

// const Input = styled.input`
//   width: 100%;
//   border: 1px solid ${BORDER};
//   border-radius: 12px;
//   padding: 12px 14px;
//   font-size: 14px;
//   outline: none;

//   &:focus {
//     border-color: rgba(4, 30, 66, 0.35);
//     box-shadow: 0 0 0 3px rgba(4, 30, 66, 0.1);
//   }
// `;

// const Select = styled.select`
//   width: 100%;
//   border: 1px solid ${BORDER};
//   border-radius: 12px;
//   padding: 12px 14px;
//   font-size: 14px;
//   background: white;
// `;

// const TextArea = styled.textarea`
//   width: 100%;
//   border: 1px solid ${BORDER};
//   border-radius: 12px;
//   padding: 12px 14px;
//   font-size: 14px;
//   resize: vertical;
//   outline: none;

//   &:focus {
//     border-color: rgba(4, 30, 66, 0.35);
//     box-shadow: 0 0 0 3px rgba(4, 30, 66, 0.1);
//   }
// `;

// const CheckboxRow = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 10px;
//   margin: 8px 0 18px;
// `;

// const CheckboxLabel = styled.label`
//   color: ${ETSU_NAVY};
//   font-weight: 600;
// `;

// const SectionTitle = styled.h3`
//   margin: 12px 0 10px;
//   font-size: 15px;
//   color: ${ETSU_NAVY};
// `;

// const AddRow = styled.div`
//   display: grid;
//   grid-template-columns: 1fr 100px;
//   gap: 10px;
//   margin-bottom: 10px;
// `;

// const RightRow = styled.div`
//   display: flex;
//   justify-content: flex-end;
//   margin-bottom: 12px;
// `;

// const MiniButton = styled.button`
//   border: 1px solid ${BORDER};
//   background: white;
//   color: ${ETSU_NAVY};
//   border-radius: 12px;
//   padding: 10px 12px;
//   font-weight: 800;
//   cursor: pointer;

//   &:hover {
//     background: #f8fafc;
//   }
// `;

// const ChipWrap = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   gap: 8px;
//   margin-bottom: 16px;
// `;

// const Chip = styled.div`
//   display: inline-flex;
//   align-items: center;
//   gap: 8px;
//   border-radius: 999px;
//   padding: 8px 12px;
//   background: #f3f4f6;
//   color: ${ETSU_NAVY};
//   font-size: 13px;
// `;

// const ChipRemove = styled.button`
//   border: none;
//   background: transparent;
//   cursor: pointer;
//   color: ${ETSU_NAVY};
//   font-weight: 900;
// `;

// const ListBlock = styled.div`
//   display: grid;
//   gap: 10px;
//   margin-bottom: 20px;
// `;

// const ListItem = styled.div`
//   border: 1px solid ${BORDER};
//   border-radius: 12px;
//   padding: 12px;
//   color: ${ETSU_NAVY};
//   font-size: 14px;
//   background: #fafafa;
// `;

// const RemoveTextButton = styled.button`
//   margin-top: 8px;
//   border: none;
//   background: transparent;
//   color: #b91c1c;
//   font-weight: 700;
//   cursor: pointer;
// `;

// const Footer = styled.div`
//   display: flex;
//   justify-content: flex-end;
//   gap: 12px;
//   margin-top: 16px;
// `;

// const SecondaryButton = styled.button`
//   border: 1px solid ${BORDER};
//   background: white;
//   color: ${ETSU_NAVY};
//   border-radius: 12px;
//   padding: 12px 16px;
//   font-weight: 800;
//   cursor: pointer;
// `;

// const SubmitButton = styled.button`
//   border: none;
//   background: ${ETSU_NAVY};
//   color: white;
//   border-radius: 12px;
//   padding: 12px 16px;
//   font-weight: 900;
//   cursor: pointer;

//   &:disabled {
//     opacity: 0.6;
//     cursor: not-allowed;
//   }
// `;

// const ErrorBox = styled.div`
//   margin-bottom: 16px;
//   border: 1px solid #fecaca;
//   background: #fef2f2;
//   color: #b91c1c;
//   border-radius: 12px;
//   padding: 12px 14px;
// `;

// const SuccessBox = styled.div`
//   margin-bottom: 16px;
//   border: 1px solid #bbf7d0;
//   background: #f0fdf4;
//   color: #166534;
//   border-radius: 12px;
//   padding: 12px 14px;
// `;


import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  FaFolderPlus,
  FaInfoCircle,
  FaLink,
  FaUsers,
  FaTools,
  FaExclamationCircle,
} from "react-icons/fa";
import { useAdminAuth } from "../AdminAuthContext";
import { ETSU_NAVY, BORDER, MUTED } from "../dashboardStyles";

const API_BASE = "https://crpp-project.onrender.com";

export default function AddProject() {
  const navigate = useNavigate();
  const { adminUser } = useAdminAuth();

  const [form, setForm] = useState({
    title: "",
    overview: "",
    short_description: "",
    supervisor: "",
    department: "",
    project_status: "In Progress",
    status: "pending",
    accepting_members: false,
    project_link: "",
    sourcecode_link: "",
    thumbnail_url: "",
    duration_start: "",
    duration_end: "",

    team_members_input: "",
    team_members: [],

    tags_input: "",
    tags: [],

    tech_stack_input: "",
    tech_stack: [],

    key_features_input: "",
    key_features: [],

    achievements_input: "",
    achievements: [],

    challenge: "",
    solution: "",
    challenges_solutions: [],
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const canSubmit = useMemo(() => {
    return (
      form.title.trim() &&
      form.overview.trim() &&
      form.supervisor.trim() &&
      form.department.trim()
    );
  }, [form]);

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function addListItem(inputKey, listKey) {
    const value = form[inputKey].trim();
    if (!value) return;

    const exists = form[listKey].some(
      (item) => item.toLowerCase() === value.toLowerCase()
    );
    if (exists) {
      updateField(inputKey, "");
      return;
    }

    setForm((prev) => ({
      ...prev,
      [listKey]: [...prev[listKey], value],
      [inputKey]: "",
    }));
  }

  function removeListItem(listKey, index) {
    setForm((prev) => ({
      ...prev,
      [listKey]: prev[listKey].filter((_, i) => i !== index),
    }));
  }

  function addChallengeSolution() {
    const challenge = form.challenge.trim();
    const solution = form.solution.trim();
    if (!challenge || !solution) return;

    setForm((prev) => ({
      ...prev,
      challenges_solutions: [
        ...prev.challenges_solutions,
        { challenge, solution },
      ],
      challenge: "",
      solution: "",
    }));
  }

  function removeChallengeSolution(index) {
    setForm((prev) => ({
      ...prev,
      challenges_solutions: prev.challenges_solutions.filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!canSubmit) {
      setError("Please fill in all required fields.");
      return;
    }

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
      status: form.status,
      department: form.department.trim(),
      project_status: form.project_status.trim(),
      accepting_members: form.accepting_members,
      tags: form.tags,
      thumbnail_url: form.thumbnail_url.trim(),
      short_description: form.short_description.trim(),
    };

    if (form.duration_start.trim()) {
      payload.duration_start = form.duration_start.trim();
    }

    if (form.duration_end.trim()) {
      payload.duration_end = form.duration_end.trim();
    }

    try {
      setSaving(true);

      const res = await fetch(`${API_BASE}/projects/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(adminUser?.access_token
            ? { Authorization: `Bearer ${adminUser.access_token}` }
            : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        const msg =
          errData?.detail
            ? Array.isArray(errData.detail)
              ? errData.detail.map((d) => d.msg).join(", ")
              : String(errData.detail)
            : `Create project failed (${res.status})`;
        throw new Error(msg);
      }

      await res.json().catch(() => null);
      setSuccessMsg("Project created successfully.");
      setTimeout(() => navigate("/admin/projects"), 800);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Page>
      <ScrollArea>
        <Card as="form" onSubmit={handleSubmit}>
          <Header>
            <HeaderIcon>
              <FaFolderPlus />
            </HeaderIcon>
            <div>
              <Title>Create New Project</Title>
              <Subtitle>
                Fill in the details below to add a new entry.
              </Subtitle>
            </div>
          </Header>

          {error ? <ErrorBox>{error}</ErrorBox> : null}
          {successMsg ? <SuccessBox>{successMsg}</SuccessBox> : null}

          <Section>
            <SectionHeading>
              <SectionIcon>
                <FaInfoCircle />
              </SectionIcon>
              <div>
                <SectionTitle>Basic Information</SectionTitle>
                <SectionSubtext>
                  Core project identity and academic details.
                </SectionSubtext>
              </div>
            </SectionHeading>

            <Field>
              <Label>Title *</Label>
              <Input
                placeholder="Enter project title"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
              />
            </Field>

            <Field>
              <Label>Short Description</Label>
              <Input
                placeholder="Short card/list description"
                value={form.short_description}
                onChange={(e) =>
                  updateField("short_description", e.target.value)
                }
              />
            </Field>

            <Grid2>
              <FormBlock>
                <Field>
                  <Label>Supervisor *</Label>
                  <Input
                    placeholder="Dr. Jane Smith"
                    value={form.supervisor}
                    onChange={(e) => updateField("supervisor", e.target.value)}
                  />
                </Field>
              </FormBlock>

              <FormBlock>
                <Field>
                  <Label>Department *</Label>
                  <Input
                    placeholder="Computer Science"
                    value={form.department}
                    onChange={(e) => updateField("department", e.target.value)}
                  />
                </Field>
              </FormBlock>
            </Grid2>

            <Field>
              <Label>Overview *</Label>
              <TextArea
                rows={6}
                placeholder="Enter project overview"
                value={form.overview}
                onChange={(e) => updateField("overview", e.target.value)}
              />
            </Field>
          </Section>

          <Section>
            <SectionHeading>
              <SectionIcon>
                <FaInfoCircle />
              </SectionIcon>
              <div>
                <SectionTitle>Status & Timeline</SectionTitle>
                <SectionSubtext>
                  Progress state and project dates.
                </SectionSubtext>
              </div>
            </SectionHeading>

            <Grid2>
              <FormBlock>
                <Field>
                  <Label>Status</Label>
                  <Select
                    value={form.status}
                    onChange={(e) => updateField("status", e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="approved">Approved</option>
                    <option value="archived">Archived</option>
                    <option value="completed">Completed</option>
                  </Select>
                </Field>
              </FormBlock>

              <FormBlock>
                <Field>
                  <Label>Project Status</Label>
                  <Select
                    value={form.project_status}
                    onChange={(e) =>
                      updateField("project_status", e.target.value)
                    }
                  >
                    <option value="Current">Current</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </Select>
                </Field>
              </FormBlock>

              <FormBlock>
                <Field>
                  <Label>Duration Start</Label>
                  <Input
                    placeholder="Jan 2026"
                    value={form.duration_start}
                    onChange={(e) =>
                      updateField("duration_start", e.target.value)
                    }
                  />
                </Field>
              </FormBlock>

              <FormBlock>
                <Field>
                  <Label>Duration End</Label>
                  <Input
                    placeholder="May 2026"
                    value={form.duration_end}
                    onChange={(e) =>
                      updateField("duration_end", e.target.value)
                    }
                  />
                </Field>
              </FormBlock>
            </Grid2>

            <CheckboxRow>
              <input
                id="accepting_members"
                type="checkbox"
                checked={form.accepting_members}
                onChange={(e) =>
                  updateField("accepting_members", e.target.checked)
                }
              />
              <CheckboxLabel htmlFor="accepting_members">
                Accepting Members
              </CheckboxLabel>
            </CheckboxRow>
          </Section>

          <Section>
            <SectionHeading>
              <SectionIcon>
                <FaLink />
              </SectionIcon>
              <div>
                <SectionTitle>Links & Media</SectionTitle>
                <SectionSubtext>
                  Public project resources and thumbnail.
                </SectionSubtext>
              </div>
            </SectionHeading>

            <Grid2>
              <FormBlock>
                <Field>
                  <Label>Project URL</Label>
                  <Input
                    placeholder="https://example.com"
                    value={form.project_link}
                    onChange={(e) => updateField("project_link", e.target.value)}
                  />
                </Field>
              </FormBlock>

              <FormBlock>
                <Field>
                  <Label>Source Code URL</Label>
                  <Input
                    placeholder="https://github.com/..."
                    value={form.sourcecode_link}
                    onChange={(e) =>
                      updateField("sourcecode_link", e.target.value)
                    }
                  />
                </Field>
              </FormBlock>
            </Grid2>

            <Field>
              <Label>Thumbnail URL</Label>
              <Input
                placeholder="https://image-url.com/thumbnail.png"
                value={form.thumbnail_url}
                onChange={(e) => updateField("thumbnail_url", e.target.value)}
              />
            </Field>
          </Section>

          <Section>
            <SectionHeading>
              <SectionIcon>
                <FaUsers />
              </SectionIcon>
              <div>
                <SectionTitle>People & Tags</SectionTitle>
                <SectionSubtext>
                  Team members and searchable labels.
                </SectionSubtext>
              </div>
            </SectionHeading>

            <GroupCard>
              <GroupTitle>Team Members</GroupTitle>
              <AddRow>
                <Input
                  placeholder="Add member"
                  value={form.team_members_input}
                  onChange={(e) =>
                    updateField("team_members_input", e.target.value)
                  }
                />
                <MiniButton
                  type="button"
                  onClick={() =>
                    addListItem("team_members_input", "team_members")
                  }
                >
                  Add
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
            </GroupCard>

            <GroupCard>
              <GroupTitle>Tags</GroupTitle>
              <AddRow>
                <Input
                  placeholder="Add tag"
                  value={form.tags_input}
                  onChange={(e) => updateField("tags_input", e.target.value)}
                />
                <MiniButton
                  type="button"
                  onClick={() => addListItem("tags_input", "tags")}
                >
                  Add
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
            </GroupCard>
          </Section>

          <Section>
            <SectionHeading>
              <SectionIcon>
                <FaTools />
              </SectionIcon>
              <div>
                <SectionTitle>Project Metadata</SectionTitle>
                <SectionSubtext>
                  Technical details, features, and achievements.
                </SectionSubtext>
              </div>
            </SectionHeading>

            <GroupCard>
              <GroupTitle>Tech Stack</GroupTitle>
              <AddRow>
                <Input
                  placeholder="Add tech"
                  value={form.tech_stack_input}
                  onChange={(e) =>
                    updateField("tech_stack_input", e.target.value)
                  }
                />
                <MiniButton
                  type="button"
                  onClick={() => addListItem("tech_stack_input", "tech_stack")}
                >
                  Add
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
            </GroupCard>

            <GroupCard>
              <GroupTitle>Key Features</GroupTitle>
              <AddRow>
                <Input
                  placeholder="Add feature"
                  value={form.key_features_input}
                  onChange={(e) =>
                    updateField("key_features_input", e.target.value)
                  }
                />
                <MiniButton
                  type="button"
                  onClick={() =>
                    addListItem("key_features_input", "key_features")
                  }
                >
                  Add
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
            </GroupCard>

            <GroupCard>
              <GroupTitle>Achievements</GroupTitle>
              <AddRow>
                <Input
                  placeholder="Add achievement"
                  value={form.achievements_input}
                  onChange={(e) =>
                    updateField("achievements_input", e.target.value)
                  }
                />
                <MiniButton
                  type="button"
                  onClick={() =>
                    addListItem("achievements_input", "achievements")
                  }
                >
                  Add
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
            </GroupCard>
          </Section>

          <Section>
            <SectionHeading>
              <SectionIcon>
                <FaExclamationCircle />
              </SectionIcon>
              <div>
                <SectionTitle>Challenges & Solutions</SectionTitle>
                <SectionSubtext>
                  Capture the project problem-solving story.
                </SectionSubtext>
              </div>
            </SectionHeading>

            <GroupCard>
              <Grid2>
                <FormBlock>
                  <Field>
                    <Label>Challenge</Label>
                    <Input
                      placeholder="Enter challenge"
                      value={form.challenge}
                      onChange={(e) => updateField("challenge", e.target.value)}
                    />
                  </Field>
                </FormBlock>

                <FormBlock>
                  <Field>
                    <Label>Solution</Label>
                    <Input
                      placeholder="Enter solution"
                      value={form.solution}
                      onChange={(e) => updateField("solution", e.target.value)}
                    />
                  </Field>
                </FormBlock>
              </Grid2>

              <RightRow>
                <MiniButton type="button" onClick={addChallengeSolution}>
                  Add Challenge/Solution
                </MiniButton>
              </RightRow>

              <ListBlock>
                {form.challenges_solutions.map((item, index) => (
                  <ListItem key={index}>
                    <div>
                      <ListLabel>Challenge</ListLabel>
                      <ListText>{item.challenge}</ListText>
                    </div>

                    <div>
                      <ListLabel>Solution</ListLabel>
                      <ListText>{item.solution}</ListText>
                    </div>

                    <RemoveTextButton
                      type="button"
                      onClick={() => removeChallengeSolution(index)}
                    >
                      Remove
                    </RemoveTextButton>
                  </ListItem>
                ))}
              </ListBlock>
            </GroupCard>
          </Section>

          <Footer>
            <SecondaryButton
              type="button"
              onClick={() => navigate("/admin/projects")}
            >
              Cancel
            </SecondaryButton>

            <SubmitButton type="submit" disabled={!canSubmit || saving}>
              {saving ? "Creating..." : "Create Project"}
            </SubmitButton>
          </Footer>
        </Card>
      </ScrollArea>
    </Page>
  );
}

const Page = styled.div`
  height: calc(100vh - 84px);
  overflow: hidden;
  padding: 16px 20px 24px;
  background: #f8fafc;
`;

const ScrollArea = styled.div`
  height: 100%;
  overflow-y: auto;
  padding-right: 6px;
`;

const Card = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  background: white;
  border: 1px solid ${BORDER};
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 10px 30px rgba(4, 30, 66, 0.06);
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 22px;
`;

const HeaderIcon = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: rgba(4, 30, 66, 0.08);
  color: ${ETSU_NAVY};
  font-size: 20px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 28px;
  line-height: 1.2;
  color: ${ETSU_NAVY};
`;

const Subtitle = styled.p`
  margin: 6px 0 0;
  color: ${MUTED};
  font-size: 16px;
`;

const Section = styled.section`
  border: 1px solid ${BORDER};
  border-radius: 18px;
  padding: 20px;
  margin-bottom: 18px;
  background: #fcfdff;
`;

const SectionHeading = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 18px;
`;

const SectionIcon = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: rgba(4, 30, 66, 0.08);
  color: ${ETSU_NAVY};
  flex-shrink: 0;
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 17px;
  color: ${ETSU_NAVY};
`;

const SectionSubtext = styled.p`
  margin: 4px 0 0;
  color: ${MUTED};
  font-size: 13px;
`;

const GroupCard = styled.div`
  border: 1px solid ${BORDER};
  border-radius: 16px;
  padding: 16px;
  background: white;
  margin-bottom: 16px;
`;

const GroupTitle = styled.h4`
  margin: 0 0 12px;
  font-size: 14px;
  color: ${ETSU_NAVY};
`;

const Grid2 = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const FormBlock = styled.div`
  min-width: 0;
`;

const Field = styled.div`
  display: grid;
  gap: 8px;
  margin-bottom: 16px;
  min-width: 0;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 700;
  color: ${ETSU_NAVY};
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

  &:focus {
    border-color: rgba(4, 30, 66, 0.35);
    box-shadow: 0 0 0 3px rgba(4, 30, 66, 0.1);
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
  background: white;
  outline: none;

  &:focus {
    border-color: rgba(4, 30, 66, 0.35);
    box-shadow: 0 0 0 3px rgba(4, 30, 66, 0.1);
  }
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

  &:focus {
    border-color: rgba(4, 30, 66, 0.35);
    box-shadow: 0 0 0 3px rgba(4, 30, 66, 0.1);
  }
`;

const CheckboxRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 8px 0 4px;
`;

const CheckboxLabel = styled.label`
  color: ${ETSU_NAVY};
  font-weight: 600;
`;

const AddRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 100px;
  gap: 10px;
  margin-bottom: 10px;
  align-items: start;

  @media (max-width: 640px) {
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
  cursor: pointer;

  &:hover {
    background: #f8fafc;
  }
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

const ListBlock = styled.div`
  display: grid;
  gap: 10px;
  margin-top: 8px;
`;

const ListItem = styled.div`
  border: 1px solid ${BORDER};
  border-radius: 14px;
  padding: 14px;
  color: ${ETSU_NAVY};
  font-size: 14px;
  background: #fafcff;
`;

const ListLabel = styled.div`
  font-size: 12px;
  font-weight: 800;
  color: ${MUTED};
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 4px;
`;

const ListText = styled.div`
  margin-bottom: 10px;
  word-break: break-word;
`;

const RemoveTextButton = styled.button`
  border: none;
  background: transparent;
  color: #b91c1c;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
`;

const Footer = styled.div`
  position: sticky;
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 18px;
  background: linear-gradient(to top, white 78%, rgba(255, 255, 255, 0.75));
`;

const SecondaryButton = styled.button`
  border: 1px solid ${BORDER};
  background: white;
  color: ${ETSU_NAVY};
  border-radius: 12px;
  padding: 12px 16px;
  font-weight: 800;
  cursor: pointer;
`;

const SubmitButton = styled.button`
  border: none;
  background: ${ETSU_NAVY};
  color: white;
  border-radius: 12px;
  padding: 12px 16px;
  font-weight: 900;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorBox = styled.div`
  margin-bottom: 16px;
  border: 1px solid #fecaca;
  background: #fef2f2;
  color: #b91c1c;
  border-radius: 12px;
  padding: 12px 14px;
`;

const SuccessBox = styled.div`
  margin-bottom: 16px;
  border: 1px solid #bbf7d0;
  background: #f0fdf4;
  color: #166534;
  border-radius: 12px;
  padding: 12px 14px;
`;