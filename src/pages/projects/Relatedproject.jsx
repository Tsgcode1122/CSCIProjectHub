import React, { useMemo, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FiArrowUpRight, FiCalendar, FiUsers } from "react-icons/fi";
import { useProjectContext } from "../../context/ProjectContext";
import { Colors, Shadows } from "../../theme/Colors";
import { media } from "../../theme/Breakpoints";

const RelatedProject = ({ currentProject }) => {
  const { projects } = useProjectContext();
  const navigate = useNavigate();
  const rowRef = useRef(null);

  const currentId = currentProject?.id || currentProject?._id;

  const related = useMemo(() => {
    if (!currentProject || !projects?.length) return [];

    const dept = currentProject.department;
    const tags = currentProject.tags || [];

    // prioritize: shared tags + same dept
    const scored = projects
      .filter((p) => {
        const pid = p.id || p._id;
        if (!pid || pid === currentId) return false;

        const sameDept = p.department === dept;
        const sharedTag = (p.tags || []).some((t) => tags.includes(t));

        return sameDept || sharedTag;
      })
      .map((p) => {
        const sameDept = p.department === dept ? 1 : 0;
        const sharedCount = (p.tags || []).filter((t) =>
          tags.includes(t),
        ).length;
        return { p, score: sharedCount * 10 + sameDept };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((x) => x.p);

    return scored;
  }, [projects, currentProject, currentId]);

  if (!related.length) return null;

  const openProject = (p) => {
    const id = p.id || p._id;
    navigate(`/projects/${id}`);
  };

  const isOngoing = (status) =>
    status === "In Progress" || status === "Accepting Members";

  return (
    <Wrap>
      <HeaderRow>
        <Title>Related Projects</Title>
        <SubTitle>More projects you may be interested in.</SubTitle>
      </HeaderRow>

      <Row ref={rowRef}>
        {related.map((p) => (
          <Card key={p.id || p._id} onClick={() => openProject(p)}>
            <Top>
              <StatusBadge $status={p.project_status}>
                {p.project_status}
              </StatusBadge>
              <CornerIcon aria-hidden="true">
                <FiArrowUpRight />
              </CornerIcon>
            </Top>

            <CardTitle title={p.title}>{p.title}</CardTitle>

            <Desc>{p.short_description}</Desc>

            <Tags>
              {(p.tags || []).slice(0, 2).map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </Tags>

            {/* <MetaRow>
              <MetaItem>
                <FiUsers />
                <span>{(p.team_members || []).length} members</span>
              </MetaItem>

              <MetaItem>
                <FiCalendar />
                <span>
                  {p.duration_start || "—"} –{" "}
                  {isOngoing(p.project_status)
                    ? "Ongoing"
                    : p.duration_end || "—"}
                </span>
              </MetaItem>
            </MetaRow> */}
          </Card>
        ))}
      </Row>
    </Wrap>
  );
};

export default RelatedProject;

/* ---------------- styles ---------------- */

const Wrap = styled.div`
  margin-top: 1.6rem;
  padding: 1.5rem;
  background: ${Colors.white};
  border: 1px solid rgba(4, 30, 66, 0.12);
  border-radius: 16px;
  box-shadow: ${Shadows.light};

  @media ${media.laptop} {
    padding: 2rem;
  }
`;

const HeaderRow = styled.div`
  display: grid;
  gap: 0.25rem;
`;

const Title = styled.h5`
  margin: 0;
  color: ${Colors.brightBlue};
  /* font-weight: 600; */
`;

const SubTitle = styled.small`
  color: rgba(0, 0, 0, 0.6);
`;

const Row = styled.div`
  margin-top: 1.1rem;
  display: flex;
  gap: 1rem;

  overflow-x: auto;
  overflow-y: hidden;
  padding: 0.2rem 0.2rem 0.6rem 0.2rem;

  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;

  /* hide scrollbar indicator */
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Card = styled.div`
  flex: 0 0 auto;
  width: 320px;

  background: ${Colors.white};
  border: 1px solid rgba(4, 30, 66, 0.12);
  border-radius: 16px;
  padding: 1rem;

  cursor: pointer;
  scroll-snap-align: start;

  transition:
    transform 160ms ease,
    box-shadow 160ms ease,
    border-color 160ms ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${Shadows.medium};
    border-color: rgba(4, 30, 66, 0.2);
  }

  @media ${media.tablet} {
    width: 360px;
  }
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.7rem;
`;

const CornerIcon = styled.div`
  color: ${Colors.etsuBlue};
  font-size: 1.1rem;
`;

const StatusBadge = styled.span`
  width: fit-content;
  padding: 0.35rem 0.6rem;
  border-radius: 9px;
  font-weight: 700;
  font-size: 0.78rem;

  background: ${({ $status }) => {
    switch ($status) {
      case "Accepting Members":
        return "rgba(255, 184, 28, 0.22)";
      case "Completed":
        return "rgba(4, 30, 66, 0.10)";
      default:
        return "rgba(4, 30, 66, 0.08)";
    }
  }};

  color: ${Colors.etsuBlue};

  border: 1px solid
    ${({ $status }) => {
      switch ($status) {
        case "Accepting Members":
          return "rgba(255, 184, 28, 0.45)";
        default:
          return "rgba(4, 30, 66, 0.12)";
      }
    }};
`;

const CardTitle = styled.h5`
  margin: 0;
  color: ${Colors.brightBlue};
  font-weight: 500;
  line-height: 1.55rem;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Desc = styled.p`
  margin: 0.55rem 0 0 0;
  color: rgba(0, 0, 0, 0.72);

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Tags = styled.div`
  margin-top: 0.75rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
`;

const Tag = styled.span`
  padding: 0.2rem 0.5rem;
  border-radius: 9px;
  background: #e8f1f8;
  border: 1px solid rgba(4, 30, 66, 0.1);
  color: #003f87ca;
  font-weight: 500;
  font-size: 0.78rem;
`;

const MetaRow = styled.div`
  margin-top: 0.85rem;
  display: flex;
  justify-content: space-between;
  gap: 0.4rem;
`;

const MetaItem = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  color: rgba(0, 0, 0, 0.65);
  font-size: 0.9rem;

  svg {
    color: ${Colors.etsuGold};
  }
`;
