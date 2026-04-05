import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaCode,
  FaEdit,
  FaExternalLinkAlt,
  FaFileAlt,
  FaFolderOpen,
  FaTrash,
  FaUserFriends,
  FaBookOpen,
  FaFlask,
} from "react-icons/fa";
import { useAdminAuth } from "../AdminAuthContext";
import { ETSU_NAVY, BORDER, MUTED } from "../dashboardStyles";

const API_BASE = "https://crpp-project.onrender.com";

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function formatTimeline(start, end) {
  if (start && end) return `${start} – ${end}`;
  if (start) return start;
  if (end) return end;
  return "No timeline provided";
}

export default function AdminEntryView() {
  const { kind, id } = useParams();
  const navigate = useNavigate();
  const { adminUser } = useAdminAuth();

  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const isProject = kind === "project";
  const isThesis = kind === "thesis";

  async function handleDeleteConfirmed() {
    try {
      setIsDeleting(true);
      setDeleteError("");

      const endpoint = isProject
        ? `${API_BASE}/projects/${id}`
        : `${API_BASE}/research/${id}`;

      const res = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          ...(adminUser?.access_token
            ? { Authorization: `Bearer ${adminUser.access_token}` }
            : {}),
        },
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        const msg = errData?.detail
          ? Array.isArray(errData.detail)
            ? errData.detail.map((d) => d.msg).join(", ")
            : String(errData.detail)
          : `Delete failed (${res.status})`;
        throw new Error(msg);
      }

      navigate("/admin/projects");
    } catch (err) {
      setDeleteError(err.message || "Failed to delete entry.");
    } finally {
      setIsDeleting(false);
    }
  }

  useEffect(() => {
    const ac = new AbortController();

    async function loadEntry() {
      try {
        setLoading(true);
        setError("");

        const endpoint = isProject
          ? `${API_BASE}/projects/${id}`
          : isThesis
            ? `${API_BASE}/research/${id}`
            : null;

        if (!endpoint) {
          throw new Error("Invalid entry type.");
        }

        const res = await fetch(endpoint, {
          signal: ac.signal,
          headers: {
            Accept: "application/json",
            ...(adminUser?.access_token
              ? { Authorization: `Bearer ${adminUser.access_token}` }
              : {}),
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to load entry (${res.status})`);
        }

        const data = await res.json();
        setEntry(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Could not load entry.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadEntry();
    return () => ac.abort();
  }, [id, isProject, isThesis, adminUser]);
  function formatTimeline(start, end, status) {
    const s = String(status ?? "")
      .toLowerCase()
      .trim();

    // Define which statuses count as "Ongoing"
    const isOngoing = s === "in progress" || s === "accepting members";

    if (isOngoing) {
      return start ? `${start} – Ongoing` : "Ongoing";
    }

    // Fallback to standard range if not ongoing
    if (start && end) return `${start} – ${end}`;
    if (start) return start;
    if (end) return end;
    return "—";
  }
  const timeline = useMemo(() => {
    if (!entry) return "";

    // Get the status from the entry
    const currentStatus = entry.project_status || entry.status || "";

    return formatTimeline(
      entry.duration_start,
      entry.duration_end,
      currentStatus,
    );
  }, [entry]);

  const pageTitle = isProject ? "Project" : "Thesis";
  const overviewTitle = isProject ? "Project Overview" : "Thesis Overview";

  if (loading) {
    return (
      <Page>
        <StateCard>Loading details...</StateCard>
      </Page>
    );
  }

  if (error || !entry) {
    return (
      <Page>
        <StateCard>
          <div style={{ fontWeight: 800, color: "#b91c1c", marginBottom: 10 }}>
            {error || "Entry not found."}
          </div>
          <BackButton type="button" onClick={() => navigate("/admin/projects")}>
            Back to Projects
          </BackButton>
        </StateCard>
      </Page>
    );
  }

  return (
    <Page>
      <ScrollArea>
        <Hero $isProject={isProject}>
          <HeroTop>
            <BackLink to="/admin/projects">
              <FaArrowLeft />
              <span>Back to Projects</span>
            </BackLink>

            <ActionRow>
              <ActionBtn
                type="button"
                onClick={() => navigate(`/admin/entries/${kind}/${id}/edit`)}
              >
                <FaEdit />
                <span>Edit</span>
              </ActionBtn>

              <DeleteBtn
                type="button"
                onClick={() => {
                  setDeleteError("");
                  setShowDeleteModal(true);
                }}
              >
                <FaTrash />
                <span>Delete</span>
              </DeleteBtn>
            </ActionRow>
          </HeroTop>

          <HeroTitle>{entry.title || `Untitled ${pageTitle}`}</HeroTitle>
          <HeroSubtitle>
            {entry.short_description ||
              entry.overview ||
              "No description provided."}
          </HeroSubtitle>
        </Hero>

        <ContentGrid>
          <LeftCol>
            <Card>
              <CardTitle>
                {isProject ? <FaFolderOpen /> : <FaBookOpen />}
                <span>{overviewTitle}</span>
              </CardTitle>

              <InfoGrid>
                <InfoBlock>
                  <InfoLabel>{isProject ? "Supervisor" : "Student"}</InfoLabel>
                  <InfoValue>
                    {isProject ? entry.supervisor || "—" : entry.student || "—"}
                  </InfoValue>
                </InfoBlock>

                <InfoBlock>
                  <InfoLabel>
                    {isProject ? "Department" : "Supervisor"}
                  </InfoLabel>
                  <InfoValue>
                    {isProject
                      ? entry.department || "—"
                      : entry.supervisor || "—"}
                  </InfoValue>
                </InfoBlock>

                <InfoBlock>
                  <InfoLabel>{isProject ? "Status" : "Department"}</InfoLabel>
                  <InfoValue>
                    {isProject ? entry.status || "—" : entry.department || "—"}
                  </InfoValue>
                </InfoBlock>

                <InfoBlock>
                  <InfoLabel>
                    {isProject ? "Project Status" : "Status"}
                  </InfoLabel>
                  <InfoValue>
                    {isProject
                      ? entry.project_status || "—"
                      : entry.status || "—"}
                  </InfoValue>
                </InfoBlock>
              </InfoGrid>

              <BodyText>{entry.overview || "No overview added."}</BodyText>
            </Card>

            {isProject ? (
              <>
                <Card>
                  <CardTitle>
                    <FaCode />
                    <span>Key Features</span>
                  </CardTitle>

                  {safeArray(entry.key_features).length ? (
                    <BulletList>
                      {entry.key_features.map((item, index) => (
                        <li key={`${item}-${index}`}>{item}</li>
                      ))}
                    </BulletList>
                  ) : (
                    <MutedText>No features added.</MutedText>
                  )}
                </Card>

                <Card>
                  <CardTitle>
                    <FaFileAlt />
                    <span>Challenges & Solutions</span>
                  </CardTitle>

                  {safeArray(entry.challenges_solutions).length ? (
                    <ChallengeList>
                      {entry.challenges_solutions.map((item, index) => (
                        <ChallengeCard key={index}>
                          <MiniLabel>Challenge</MiniLabel>
                          <ChallengeText>{item.challenge || "—"}</ChallengeText>

                          <MiniLabel>Solution</MiniLabel>
                          <ChallengeText>{item.solution || "—"}</ChallengeText>
                        </ChallengeCard>
                      ))}
                    </ChallengeList>
                  ) : (
                    <MutedText>No challenges added.</MutedText>
                  )}
                </Card>

                <Card>
                  <CardTitle>
                    <FaCode />
                    <span>Achievements</span>
                  </CardTitle>

                  {safeArray(entry.achievements).length ? (
                    <BulletList>
                      {entry.achievements.map((item, index) => (
                        <li key={`${item}-${index}`}>{item}</li>
                      ))}
                    </BulletList>
                  ) : (
                    <MutedText>No achievements added.</MutedText>
                  )}
                </Card>
              </>
            ) : (
              <>
                <Card>
                  <CardTitle>
                    <FaFlask />
                    <span>Methodology</span>
                  </CardTitle>
                  <BodyText>
                    {entry.methodology || "No methodology added."}
                  </BodyText>
                </Card>

                <Card>
                  <CardTitle>
                    <FaFileAlt />
                    <span>Key Findings</span>
                  </CardTitle>
                  <BodyText>
                    {entry.key_findings || "No key findings added."}
                  </BodyText>
                </Card>

                <Card>
                  <CardTitle>
                    <FaCode />
                    <span>Future Work</span>
                  </CardTitle>
                  <BodyText>
                    {entry.future_work || "No future work added."}
                  </BodyText>
                </Card>
              </>
            )}
          </LeftCol>

          <RightCol>
            <Card>
              <CardTitle>{pageTitle} Info</CardTitle>

              <InfoStack>
                <InfoRow>
                  <InfoLabel>Type</InfoLabel>
                  <Pill $isProject={isProject}>
                    {isProject ? "Project" : "Thesis"}
                  </Pill>
                </InfoRow>

                <InfoRow>
                  <InfoLabel>
                    <FaCalendarAlt style={{ marginRight: 8 }} />
                    Timeline
                  </InfoLabel>
                  <InfoValue>{timeline}</InfoValue>
                </InfoRow>

                {isProject ? (
                  <InfoRow>
                    <InfoLabel>
                      <FaUserFriends style={{ marginRight: 8 }} />
                      Team Members
                    </InfoLabel>
                    {safeArray(entry.team_members).length ? (
                      <TagWrap>
                        {entry.team_members.map((member, index) => (
                          <Tag key={`${member}-${index}`}>{member}</Tag>
                        ))}
                      </TagWrap>
                    ) : (
                      <MutedText>No team members</MutedText>
                    )}
                  </InfoRow>
                ) : (
                  <InfoRow>
                    <InfoLabel>Researcher</InfoLabel>
                    <InfoValue>{entry.student || "—"}</InfoValue>
                  </InfoRow>
                )}

                {isProject && entry.project_link ? (
                  <LinkButton
                    href={entry.project_link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaExternalLinkAlt />
                    <span>View Project</span>
                  </LinkButton>
                ) : null}

                {isProject && entry.sourcecode_link ? (
                  <LinkButton
                    href={entry.sourcecode_link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaCode />
                    <span>View Source Code</span>
                  </LinkButton>
                ) : null}
              </InfoStack>
            </Card>

            {isProject ? (
              <>
                <Card>
                  <CardTitle>Tech Stack</CardTitle>
                  {safeArray(entry.tech_stack).length ? (
                    <TagWrap>
                      {entry.tech_stack.map((item, index) => (
                        <Tag key={`${item}-${index}`}>{item}</Tag>
                      ))}
                    </TagWrap>
                  ) : (
                    <MutedText>No tech stack added.</MutedText>
                  )}
                </Card>

                <Card>
                  <CardTitle>Tags</CardTitle>
                  {safeArray(entry.tags).length ? (
                    <TagWrap>
                      {entry.tags.map((item, index) => (
                        <Tag key={`${item}-${index}`}>{item}</Tag>
                      ))}
                    </TagWrap>
                  ) : (
                    <MutedText>No tags added.</MutedText>
                  )}
                </Card>
              </>
            ) : (
              <>
                <Card>
                  <CardTitle>Publications</CardTitle>
                  {safeArray(entry.publications).length ? (
                    <PublicationList>
                      {entry.publications.map((pub, index) => (
                        <PublicationCard key={index}>
                          <PublicationTitle>
                            {pub.title || "Untitled publication"}
                          </PublicationTitle>
                          {pub.link ? (
                            <PublicationLink
                              href={pub.link}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Open Publication
                            </PublicationLink>
                          ) : null}
                          <PublicationDate>
                            {pub.published_on
                              ? new Date(pub.published_on).toLocaleDateString()
                              : "No publish date"}
                          </PublicationDate>
                        </PublicationCard>
                      ))}
                    </PublicationList>
                  ) : (
                    <MutedText>No publications added.</MutedText>
                  )}
                </Card>

                <Card>
                  <CardTitle>Tags</CardTitle>
                  {safeArray(entry.tags).length ? (
                    <TagWrap>
                      {entry.tags.map((item, index) => (
                        <Tag key={`${item}-${index}`}>{item}</Tag>
                      ))}
                    </TagWrap>
                  ) : (
                    <MutedText>No tags added.</MutedText>
                  )}
                </Card>
              </>
            )}
          </RightCol>
        </ContentGrid>
      </ScrollArea>

      {showDeleteModal ? (
        <DeleteOverlay>
          <DeleteModal>
            <DeleteHeader>
              <DeleteIconWrap>
                <FaTrash />
              </DeleteIconWrap>

              <div>
                <DeleteTitle>
                  Delete {isProject ? "Project" : "Thesis"}?
                </DeleteTitle>
                <DeleteText>
                  This action cannot be undone. This will permanently delete
                  this {isProject ? "project" : "thesis"} from the system.
                </DeleteText>
                <DeleteName>{entry?.title || "Untitled entry"}</DeleteName>
              </div>
            </DeleteHeader>

            {deleteError ? <DeleteError>{deleteError}</DeleteError> : null}

            <DeleteActions>
              <CancelBtn
                type="button"
                disabled={isDeleting}
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteError("");
                }}
              >
                Cancel
              </CancelBtn>

              <ConfirmDeleteBtn
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteConfirmed}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </ConfirmDeleteBtn>
            </DeleteActions>
          </DeleteModal>
        </DeleteOverlay>
      ) : null}
    </Page>
  );
}

const Page = styled.div`
  height: calc(100vh - 84px);
  overflow: hidden;
  background: #f5f7fb;
  display: flex;
  flex-direction: column;
`;

const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  min-height: 0;
`;

const Hero = styled.div`
  background: ${({ $isProject }) =>
    $isProject
      ? "radial-gradient(circle at center, #f4d03f 0%, #d4a017 65%, #8a6508 100%)"
      : "radial-gradient(circle at center, #4f97ef 0%, #0b2b58 65%, #061222 100%)"};

  color: ${({ $isProject }) => ($isProject ? "#1f2937" : "white")};
  padding: 24px 32px 28px;
`;

const HeroTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: inherit;
  text-decoration: none;
  font-weight: 500;
  opacity: 0.95;
`;

const ActionRow = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: white;
  color: ${ETSU_NAVY};
  border: 2px solid #f4d03f;
  border-radius: 12px;
  padding: 10px 14px;
  font-weight: 800;
  cursor: pointer;
`;

const DeleteBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: white;
  color: #ff5f5f;
  border: 2px solid #ff8a8a;
  border-radius: 12px;
  padding: 10px 14px;
  font-weight: 800;
  cursor: pointer;
`;

const HeroTitle = styled.h1`
  margin: 0 0 12px;
  font-size: 2.2rem;
  line-height: 1.15;
`;

const HeroSubtitle = styled.p`
  margin: 0;
  max-width: 900px;
  font-size: 1.05rem;
  line-height: 1.65;
  color: inherit;
  opacity: 0.88;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(300px, 0.95fr);
  gap: 24px;
  padding: 32px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

const LeftCol = styled.div`
  display: grid;
  gap: 24px;
`;

const RightCol = styled.div`
  display: grid;
  gap: 24px;
  align-content: start;
`;

const Card = styled.div`
  background: white;
  border: 1px solid ${BORDER};
  border-radius: 18px;
  padding: 22px;
  box-shadow: 0 8px 24px rgba(4, 30, 66, 0.04);
`;

const CardTitle = styled.h2`
  margin: 0 0 22px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${ETSU_NAVY};
  font-size: 1.05rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;
  margin-bottom: 22px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const InfoBlock = styled.div`
  min-width: 0;
`;

const InfoLabel = styled.div`
  color: ${MUTED};
  font-size: 0.95rem;
  margin-bottom: 8px;
`;

const InfoValue = styled.div`
  color: ${ETSU_NAVY};
  font-size: 1.05rem;
  font-weight: 500;
  word-break: break-word;
`;

const BodyText = styled.div`
  color: ${ETSU_NAVY};
  line-height: 1.8;
  white-space: pre-wrap;
`;

const BulletList = styled.ul`
  margin: 0;
  padding-left: 20px;
  color: ${ETSU_NAVY};

  li {
    margin-bottom: 10px;
    line-height: 1.6;
  }
`;

const ChallengeList = styled.div`
  display: grid;
  gap: 14px;
`;

const ChallengeCard = styled.div`
  border: 1px solid ${BORDER};
  border-radius: 14px;
  padding: 16px;
  background: #fafcff;
`;

const MiniLabel = styled.div`
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${MUTED};
  font-weight: 800;
  margin-bottom: 6px;
`;

const ChallengeText = styled.div`
  color: ${ETSU_NAVY};
  line-height: 1.6;
  margin-bottom: 12px;
`;

const InfoStack = styled.div`
  display: grid;
  gap: 18px;
`;

const InfoRow = styled.div`
  display: grid;
  gap: 10px;
`;

const Pill = styled.span`
  display: inline-flex;
  align-items: center;
  width: fit-content;
  padding: 6px 10px;
  background: ${({ $isProject }) => ($isProject ? ETSU_NAVY : "#d4a017")};
  color: ${({ $isProject }) => ($isProject ? "white" : "#1f2937")};
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 700;
`;

const TagWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 10px;
  background: #e9f0fb;
  color: ${ETSU_NAVY};
  font-size: 0.9rem;
`;

const LinkButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 1px solid ${BORDER};
  border-radius: 12px;
  padding: 12px 14px;
  color: ${ETSU_NAVY};
  text-decoration: none;
  font-weight: 700;
  background: #fff;
`;

const MutedText = styled.div`
  color: ${MUTED};
  font-style: italic;
`;

const PublicationList = styled.div`
  display: grid;
  gap: 12px;
`;

const PublicationCard = styled.div`
  border: 1px solid ${BORDER};
  border-radius: 14px;
  padding: 14px;
  background: #fafcff;
`;

const PublicationTitle = styled.div`
  color: ${ETSU_NAVY};
  font-weight: 700;
  margin-bottom: 8px;
`;

const PublicationLink = styled.a`
  color: ${ETSU_NAVY};
  font-weight: 600;
  text-decoration: none;
`;

const PublicationDate = styled.div`
  color: ${MUTED};
  font-size: 0.9rem;
  margin-top: 8px;
`;

const StateCard = styled.div`
  margin: 24px;
  background: white;
  border: 1px solid ${BORDER};
  border-radius: 18px;
  padding: 24px;
`;

const BackButton = styled.button`
  border: 1px solid ${BORDER};
  background: white;
  color: ${ETSU_NAVY};
  border-radius: 12px;
  padding: 10px 14px;
  font-weight: 700;
  cursor: pointer;
`;

const DeleteOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: grid;
  place-items: center;
  padding: 20px;
  z-index: 9999;
`;

const DeleteModal = styled.div`
  width: 100%;
  max-width: 520px;
  background: white;
  border-radius: 20px;
  padding: 24px;
  border: 1px solid ${BORDER};
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.18);
`;

const DeleteHeader = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-start;
`;

const DeleteIconWrap = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: rgba(239, 68, 68, 0.12);
  color: #dc2626;
  font-size: 18px;
  flex-shrink: 0;
`;

const DeleteTitle = styled.h3`
  margin: 0 0 8px;
  font-size: 24px;
  line-height: 1.1;
  color: ${ETSU_NAVY};
`;

const DeleteText = styled.p`
  margin: 0;
  color: ${MUTED};
  line-height: 1.6;
  font-size: 16px;
`;

const DeleteName = styled.div`
  margin-top: 14px;
  color: ${ETSU_NAVY};
  font-weight: 800;
`;

const DeleteError = styled.div`
  margin-top: 16px;
  border: 1px solid #fecaca;
  background: #fef2f2;
  color: #b91c1c;
  border-radius: 12px;
  padding: 12px 14px;
`;

const DeleteActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 24px;
`;

const CancelBtn = styled.button`
  border: 1px solid ${BORDER};
  background: white;
  color: ${ETSU_NAVY};
  border-radius: 12px;
  padding: 10px 16px;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

const ConfirmDeleteBtn = styled.button`
  border: none;
  background: #ef4444;
  color: white;
  border-radius: 12px;
  padding: 10px 16px;
  font-weight: 800;
  cursor: pointer;

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;
