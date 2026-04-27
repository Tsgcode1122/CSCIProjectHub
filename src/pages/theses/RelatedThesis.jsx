import React, { useMemo, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FiArrowUpRight, FiCalendar, FiUser } from "react-icons/fi";
import { useThesesContext } from "../../context/ThesesContext";
import { Colors, Shadows } from "../../theme/Colors";
import { media } from "../../theme/Breakpoints";

const RelatedThesis = ({ currentThesis }) => {
  const { theses } = useThesesContext();
  const navigate = useNavigate();
  const rowRef = useRef(null);

  const currentId =
    currentThesis?.id || currentThesis?._id || currentThesis?.title;

  const related = useMemo(() => {
    if (!currentThesis || !theses?.length) return [];

    const dept = currentThesis.department;
    const tags = currentThesis.tags || [];

    // prioritize: shared tags + same dept
    const scored = theses
      .filter((t) => {
        const tid = t.id || t._id || t.title;
        if (!tid || tid === currentId) return false;

        const sameDept = t.department === dept;
        const sharedTag = (t.tags || []).some((tag) => tags.includes(tag));

        return sameDept || sharedTag;
      })
      .map((t) => {
        const sameDept = t.department === dept ? 1 : 0;
        const sharedCount = (t.tags || []).filter((tag) =>
          tags.includes(tag),
        ).length;
        return { t, score: sharedCount * 10 + sameDept };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((x) => x.t);

    return scored;
  }, [theses, currentThesis, currentId]);

  if (!related.length) return null;

  const openThesis = (t) => {
    const id = t.id || t._id || t.title;
    navigate(`/theses/${id}`);
  };

  const isOngoing = (status) => status === "In Progress";

  return (
    <Wrap>
      <HeaderRow>
        <Title>Related Theses</Title>
        <SubTitle>More research and theses you may be interested in.</SubTitle>
      </HeaderRow>

      <Row ref={rowRef}>
        {related.map((t) => (
          <Card key={t.id || t._id || t.title} onClick={() => openThesis(t)}>
            <Top>
              <StatusBadge $status={t.status}>{t.status}</StatusBadge>
              <CornerIcon aria-hidden="true">
                <FiArrowUpRight />
              </CornerIcon>
            </Top>

            <CardTitle title={t.title}>{t.title}</CardTitle>

            {/* <Desc>{t.short_description || t.overview}</Desc> */}

            <Tags>
              {(t.tags || []).slice(0, 2).map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </Tags>

            {/* Optional: Uncomment to show MetaRow on related cards */}
            {/* <MetaRow>
              <MetaItem>
                <FiUser />
                <span>{t.student || "Student"}</span>
              </MetaItem>

              <MetaItem>
                <FiCalendar />
                <span>
                  {t.duration_start || "—"} –{" "}
                  {isOngoing(t.status)
                    ? "Ongoing"
                    : t.duration_end || "—"}
                </span>
              </MetaItem>
            </MetaRow> */}
          </Card>
        ))}
      </Row>
    </Wrap>
  );
};

export default RelatedThesis;

/* ---------------- styles ---------------- */

const Wrap = styled.div`
  margin-top: 1.6rem;
  padding: 1.3rem;
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
  width: 280px;

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
  display: inline-block;

  background: ${({ $status }) => {
    switch ($status) {
      case "Accepting Members":
        return "#ffb71c8b";

      case "In Progress":
        return "rgba(62, 66, 4, 0.08)";
      default:
        return "#FFB81C";
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

const CardTitle = styled.h5`
  margin: 0;
  color: ${Colors.brightBlue};
  font-weight: 400;
  line-height: 1.55rem;

  /* overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; */
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
