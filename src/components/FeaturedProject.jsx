import React, { useMemo, useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  FiArrowUpRight,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiUsers,
} from "react-icons/fi";
import SectionDiv from "../fixedComponent/SectionDiv";
import SectionHeader from "../fixedComponent/SectionHeader";
import { Colors, Shadows } from "../theme/Colors";
import { media } from "../theme/Breakpoints";
import { useProjectContext } from "../context/ProjectContext";
import ETSUButton from "../fixedComponent/ETSUButton";

const FeaturedProject = () => {
  const navigate = useNavigate();
  const { projects, loading } = useProjectContext();
  const rowRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);

  const featured = useMemo(() => {
    if (!projects?.length) return [];

    const isOngoing = (s) => s === "In Progress" || s === "Accepting Members";

    const parseMonthYear = (str) => {
      if (!str) return 0;
      const d = new Date(str);
      const t = d.getTime();
      return Number.isFinite(t) ? t : 0;
    };

    const score = (p) => {
      const status = p.project_status;
      if (isOngoing(status)) return Number.MAX_SAFE_INTEGER - 1;

      const byDuration = parseMonthYear(p.duration_end);
      if (byDuration) return byDuration;

      const byUpdated = p.updated_at ? new Date(p.updated_at).getTime() : 0;
      const byCreated = p.created_at ? new Date(p.created_at).getTime() : 0;

      return byUpdated || byCreated || 0;
    };

    return [...projects].sort((a, b) => score(b) - score(a)).slice(0, 8);
  }, [projects]);

  const openProject = (p) => {
    const id = p.id || p._id;
    navigate(`/projects/${id}`);
  };

  const scrollByCard = (dir = 1) => {
    const el = rowRef.current;
    if (!el) return;

    // scroll by ~ one card width + gap
    const firstCard = el.querySelector("[data-card='featured']");
    const cardWidth = firstCard?.getBoundingClientRect().width || 320;
    const gap = 16; // close enough
    el.scrollBy({ left: dir * (cardWidth + gap), behavior: "smooth" });
  };
  const scrollToIndex = (idx) => {
    const el = rowRef.current;
    if (!el) return;

    const step = getCardStep();
    el.scrollTo({ left: idx * step, behavior: "smooth" });
  };

  const handlePrev = () => {
    if (activeIndex <= 0) return;
    scrollToIndex(activeIndex - 1);
  };

  const handleNext = () => {
    if (activeIndex >= maxIndex) return;
    scrollToIndex(activeIndex + 1);
  };
  const getCardStep = () => {
    const el = rowRef.current;
    if (!el) return 320;

    const firstCard = el.querySelector("[data-card='featured']");
    const cardWidth = firstCard?.getBoundingClientRect().width || 320;

    const gap = 16; // close enough; your Row gap is 1rem (~16px)
    return cardWidth + gap;
  };

  const updateProgress = () => {
    const el = rowRef.current;
    if (!el) return;

    const step = getCardStep();
    const idx = Math.round(el.scrollLeft / step);

    setActiveIndex(idx);

    // max index depends on how far you can scroll
    const max = Math.max(
      0,
      Math.round((el.scrollWidth - el.clientWidth) / step),
    );
    setMaxIndex(max);
  };
  const isOngoing = (status) =>
    status === "In Progress" || status === "Accepting Members";

  useEffect(() => {
    updateProgress();

    const el = rowRef.current;
    if (!el) return;

    const onScroll = () => updateProgress();
    const onResize = () => updateProgress();

    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [featured.length]);
  return (
    <SectionDiv>
      <Wrap>
        <HeaderRow>
          <SectionHeader
            title="Featured Capstone Projects"
            subtitle="Swipe or use the arrows to explore recent projects across the Department of Computing."
          />

          {/* arrows only show on tablet+ */}
        </HeaderRow>

        {loading ? (
          <LoadingRow>Loading featured projects…</LoadingRow>
        ) : (
          <Row ref={rowRef}>
            {featured.map((p) => (
              <Card
                data-card="featured"
                key={p.id || p._id}
                onClick={() => openProject(p)}
              >
                <Top>
                  <StatusBadge $status={p.project_status}>
                    {p.project_status}
                  </StatusBadge>
                  <CornerIcon aria-hidden="true">
                    <FiArrowUpRight />
                  </CornerIcon>
                </Top>

                <Title>{p.title}</Title>
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
        )}

        {/* Prev / Next centered */}
        <Controls>
          <NavBtn
            type="button"
            onClick={handlePrev}
            disabled={activeIndex === 0}
          >
            <FiChevronLeft />
          </NavBtn>
          {/* Dots indicator */}
          <Dots>
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <Dot key={i} $active={i === activeIndex} />
            ))}
          </Dots>
          <NavBtn
            type="button"
            onClick={handleNext}
            disabled={activeIndex === maxIndex}
          >
            <FiChevronRight />
          </NavBtn>
        </Controls>
      </Wrap>

      <ButtonWrap>
        <ETSUButton text="View All Projects" to="/projects" />
      </ButtonWrap>
    </SectionDiv>
  );
};

export default FeaturedProject;

/* ---------------- styles ---------------- */

const Wrap = styled.div`
  padding: 2.2rem 0;
`;

const LoadingRow = styled.div`
  margin-top: 1.2rem;
  color: rgba(0, 0, 0, 0.65);
`;

const Row = styled.div`
  margin-top: 1.4rem;
  display: flex;
  gap: 1rem;

  overflow-x: auto;
  overflow-y: hidden;
  padding: 0.2rem 0.2rem 0.8rem 0.2rem;

  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;

  /* remove progress indicator (scrollbar) */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Chrome/Safari */
  }

  @media ${media.tablet} {
    gap: 1.2rem;
  }
`;
const ButtonWrap = styled.div`
  display: flex;
  justify-content: center;
`;
const HeaderRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
`;

const Controls = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  align-items: center;
`;

const NavBtn = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 14px;
  border: 1px solid rgba(4, 30, 66, 0.12);
  background: ${Colors.white};
  cursor: pointer;
  box-shadow: ${Shadows.light};

  display: grid;
  place-items: center;
  font-weight: 700;
  cursor: pointer;
  box-shadow: ${Shadows.light};

  transition:
    transform 160ms ease,
    box-shadow 160ms ease;

  svg {
    font-size: 1.2rem;
    color: ${Colors.etsuBlue};
  }

  &:hover {
    box-shadow: ${Shadows.medium};
    transform: translateY(-1px);
  }
  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    transform: none;
    box-shadow: ${Shadows.light};
  }
`;

const Dots = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.45rem;
`;

const Dot = styled.span`
  width: ${({ $active }) => ($active ? "20px" : "8px")};
  height: 8px;
  border-radius: 999px;
  background: ${({ $active }) =>
    $active ? Colors.etsuGold : "rgba(4, 30, 66, 0.18)"};

  transition:
    width 180ms ease,
    background 180ms ease;
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
  right: 0rem;
  border-radius: 9px;
  font-weight: 700;
  font-size: 0.78rem;
  display: inline-block;
  position: relative !important;
  @media ${media.mobileS} {
    display: none;
  }
  @media ${media.mobileXS} {
    display: none;
  }
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

const Title = styled.h5`
  margin: 0;
  color: ${Colors.brightBlue};
  font-weight: 400;
  line-height: 1.5rem;

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
  font-weight: 300;
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
