import React, { useMemo } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import SectionDiv from "../../fixedComponent/SectionDiv";
import BackButton from "../../fixedComponent/BackButton"; // optional if you already have it
import { Colors, Shadows } from "../../theme/Colors";
import { media } from "../../theme/Breakpoints";
import { useProjectContext } from "../../context/ProjectContext";
import {
  FiArrowLeft,
  FiExternalLink,
  FiGithub,
  FiUsers,
  FiCalendar,
} from "react-icons/fi";
import { GoStack } from "react-icons/go";
import RelatedProject from "./Relatedproject";

const ProjectDetail = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { projects, loading, error } = useProjectContext();

  const project = useMemo(() => {
    return projects?.find((p) => String(p.id || p._id) === String(projectId));
  }, [projects, projectId]);

  if (loading) return <SectionDiv>Loading project...</SectionDiv>;
  if (error) return <SectionDiv>Failed to load project: {error}</SectionDiv>;

  if (!project) {
    return (
      <SectionDiv>
        <NotFound>
          <h3>Project not found</h3>
          <p>The project you are looking for may not exist.</p>

          <PrimaryBtn type="button" onClick={() => navigate("/projects")}>
            Back to Projects
          </PrimaryBtn>
        </NotFound>
      </SectionDiv>
    );
  }

  return (
    <>
      {/* HEADER (BLUE BANNER) */}
      <HeaderWrap>
        <SectionDiv>
          <HeaderInner>
            <BackButton label="Back to Projects" />

            <TitleRow>
              <HeaderTitle>{project.title}</HeaderTitle>
              {/* <StatusBadge $status={project.project_status}>
                {project.project_status}
              </StatusBadge> */}
            </TitleRow>

            {/* {project.short_description && (
              <HeaderDesc>{project.short_description}</HeaderDesc>
            )} */}

            {(project.tags || []).length > 0 && (
              <TagRow>
                {project.tags.slice(0, 3).map((t) => (
                  <HeaderTag key={t}>{t}</HeaderTag>
                ))}
              </TagRow>
            )}
          </HeaderInner>
        </SectionDiv>
      </HeaderWrap>

      {/* BODY */}
      <SectionDiv>
        <Body>
          {/* OVERVIEW CARD */}
          <Card>
            <TitleRow>
              <CardTitle>Project Overview</CardTitle>
              <StatusBadge $status={project.project_status}>
                {project.project_status}
              </StatusBadge>
            </TitleRow>
            <CardText>{project.overview || "—"}</CardText>

            <CardDivider />

            <MiniGrid>
              <MiniItem>
                <MiniIcon>
                  <FiUsers />
                </MiniIcon>
                <MiniText>
                  <MiniLabel>Team Members</MiniLabel>
                  <MiniValue>
                    {(project.team_members || []).length
                      ? project.team_members.join(", ")
                      : "—"}
                  </MiniValue>
                </MiniText>
              </MiniItem>
              <MiniItem>
                <MiniIcon>
                  <FiUsers />
                </MiniIcon>
                <MiniText>
                  <MiniLabel>Supervisor</MiniLabel>
                  <MiniValue>{project.supervisor || "—"}</MiniValue>
                </MiniText>
              </MiniItem>
              <MiniItem>
                <MiniIcon>
                  <FiCalendar />
                </MiniIcon>
                <MiniText>
                  <MiniLabel>Timeline</MiniLabel>
                  <MiniValue>
                    {project.duration_start || "—"} –{" "}
                    {project.project_status === "In Progress" ||
                    project.project_status === "Accepting Members"
                      ? "Ongoing"
                      : project.duration_end || "—"}
                  </MiniValue>
                </MiniText>
              </MiniItem>

              {/* NEW: Supervisor */}

              {/* NEW: Tech Stack */}
              <MiniItem>
                <MiniIcon>
                  <GoStack />
                </MiniIcon>
                <MiniText>
                  <MiniLabel>Tech Stack</MiniLabel>
                  <MiniValue>
                    {(project.tech_stack || []).length
                      ? project.tech_stack.join(", ")
                      : "—"}
                  </MiniValue>
                </MiniText>
              </MiniItem>
            </MiniGrid>

            <BtnRow>
              {project.project_link?.trim() && (
                <OutlineBtn
                  as="a"
                  href={project.project_link}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FiExternalLink />
                  View Live Project
                </OutlineBtn>
              )}

              {project.sourcecode_link?.trim() && (
                <OutlineBtn
                  as="a"
                  href={project.sourcecode_link}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FiGithub />
                  View Source Code
                </OutlineBtn>
              )}
            </BtnRow>
          </Card>

          {/* KEY FEATURES */}
          {(project.key_features || []).length > 0 && (
            <Card>
              <CardTitle>Key Features</CardTitle>
              <BulletList>
                {project.key_features.map((f, idx) => (
                  <BulletItem key={idx}>{f}</BulletItem>
                ))}
              </BulletList>
            </Card>
          )}

          {/* CHALLENGES & SOLUTIONS */}
          {(project.challenges_solutions || []).length > 0 && (
            <Card>
              <CardTitle>Challenges & Solutions</CardTitle>
              <BulletList>
                {project.challenges_solutions.map((cs, idx) => (
                  <BulletItem key={idx}>
                    <b>{cs.challenge}</b>
                    <br />
                    <span>{cs.solution}</span>
                  </BulletItem>
                ))}
              </BulletList>
            </Card>
          )}

          {/* ACHIEVEMENTS */}
          {(project.achievements || []).length > 0 && (
            <Card>
              <CardTitle>Achievements</CardTitle>
              <BulletList>
                {project.achievements.map((a, idx) => (
                  <BulletItem key={idx}>{a}</BulletItem>
                ))}
              </BulletList>
            </Card>
          )}
        </Body>
        <RelatedProject currentProject={project} />
      </SectionDiv>
    </>
  );
};

export default ProjectDetail;

/* ---------------- styles ---------------- */

const HeaderWrap = styled.header`
  background: ${Colors.brightBlue};
  color: ${Colors.white};
  padding: 0.2rem 0;
  @media ${media.tablet} {
    /* padding: 2.6rem 0 3rem 0; */
  }
`;

const HeaderInner = styled.div`
  display: grid;
  gap: 1.2rem;

  max-width: 1400px;
  margin: 0 auto;
  @media ${media.tablet} {
    gap: 1.4rem;
  }
`;

const TitleRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  /* align-items: center; */
  flex-wrap: wrap;
  position: relative;
`;

const HeaderTitle = styled.h4`
  margin: 0;
  font-weight: 500;
  letter-spacing: 0.01em;
  line-height: 1.15;
`;

const StatusBadge = styled.span`
  width: fit-content;
  padding: 0.35rem 0.6rem;
  right: 0rem;
  border-radius: 9px;
  font-weight: 700;
  font-size: 0.78rem;
  display: inline-block;
  position: relative !important;

  background: ${({ $status }) => {
    switch ($status) {
      case "Accepting Members":
        return "#FFB81C";
      case "In Progress":
      default:
        return "rgba(4, 30, 66, 0.08)";
    }
  }};

  color: ${({ $status }) => {
    switch ($status) {
      case "Completed":
        return "#003b7f";
      case "In Progress":
        return "rgba(4, 30, 66, 0.85)";
      case "Accepting Members":
        return Colors.etsuBlue;
      default:
        return "rgba(4, 30, 66, 0.85)";
    }
  }};

  border: 1px solid
    ${({ $status }) => {
      switch ($status) {
        case "Completed":
          return "rgba(4, 30, 66, 0.12)";
        case "Accepting Members":
          return "rgba(255, 184, 28, 0.45)";
        default:
          return "rgba(4, 30, 66, 0.12)";
      }
    }};
`;
const HeaderDesc = styled.p`
  margin: 0;
  max-width: 980px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.5;
`;

const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
`;

const HeaderTag = styled.span`
  padding: 0.2rem 0.5rem;
  border-radius: 9px;
  border: 1px solid rgba(216, 219, 224, 0.1);
  font-weight: 300;
  font-size: 0.78rem;

  background: rgba(255, 255, 255, 0.16);
  color: rgba(255, 255, 255, 0.92);
`;

const Body = styled.div`
  padding: 2.2rem 0 3rem 0;
  display: grid;
  gap: 1.4rem;
`;

const Card = styled.section`
  background: ${Colors.white};
  border: 1px solid rgba(4, 30, 66, 0.12);
  border-radius: 16px;
  box-shadow: ${Shadows.light};
  padding: 1.4rem 1.25rem;

  @media ${media.tablet} {
    padding: 1.6rem 1.6rem;
  }
`;

const CardTitle = styled.h5`
  margin: 0 0 1rem 0;
  color: ${Colors.brightBlue};
  font-weight: 600;
  @media ${media.laptop} {
    font-weight: 500;
  }
`;

const CardText = styled.p`
  margin: 0;
  color: rgba(0, 0, 0, 0.72);
  line-height: 1.7;
`;

const CardDivider = styled.div`
  margin: 1.2rem 0 1.1rem 0;
  height: 1px;
  background: rgba(4, 30, 66, 0.08);
`;

const MiniGrid = styled.div`
  display: grid;
  gap: 0.9rem;

  @media ${media.tablet} {
    grid-template-columns: 1fr 1fr;
  }
`;

const MiniItem = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const MiniIcon = styled.div`
  margin-top: 0.15rem;
  color: ${Colors.etsuGold};
  font-size: 1.05rem;
`;

const MiniText = styled.div``;

const MiniLabel = styled.div`
  font-size: 0.85rem;
  font-weight: 800;
  color: rgba(0, 0, 0, 0.55);
`;

const MiniValue = styled.div`
  margin-top: 0.25rem;
  color: rgba(0, 0, 0, 0.75);
  line-height: 1.45;
`;

const BtnRow = styled.div`
  margin-top: 1.2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const OutlineBtn = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;

  padding: 0.65rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  text-decoration: none;

  /* font-weight: 700; */
  font-size: 0.9rem;

  color: ${Colors.brightBlue};
  background: ${Colors.white};
  border: 1px solid #003f87;

  transition:
    transform 160ms ease,
    box-shadow 160ms ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${Shadows.medium};
  }
`;

const BulletList = styled.ul`
  margin: 0;
  padding-left: 1.1rem;
  display: grid;
  gap: 0.65rem;
  li::marker {
    color: ${Colors.etsuGold};
  }
`;

const BulletItem = styled.li`
  color: rgba(0, 0, 0, 0.72);
  line-height: 1.6;

  b {
    color: rgba(0, 0, 0, 0.82);
  }

  span {
    color: rgba(0, 0, 0, 0.7);
  }
`;

const NotFound = styled.div`
  min-height: 60vh;
  display: grid;
  place-items: center;
  text-align: center;
  gap: 0.7rem;

  h3 {
    margin: 0;
  }

  p {
    margin: 0;
    opacity: 0.8;
  }
`;

const PrimaryBtn = styled.button`
  border: none;
  cursor: pointer;
  border-radius: 10px;
  padding: 0.75rem 1.1rem;
  font-weight: 800;
  background: ${Colors.etsuGold};
  color: ${Colors.etsuBlue};
`;
