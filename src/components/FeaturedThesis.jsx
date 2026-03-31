import React, { useMemo, useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FiArrowUpRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import SectionDiv from "../fixedComponent/SectionDiv";
import SectionHeader from "../fixedComponent/SectionHeader";
import { Colors, Shadows } from "../theme/Colors";
import { media } from "../theme/Breakpoints";
import { useThesesContext } from "../context/ThesesContext"; // Updated Context
import ETSUButton from "../fixedComponent/ETSUButton";

const FeaturedThesis = () => {
  const navigate = useNavigate();
  const { theses, loading } = useThesesContext();
  const rowRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);

  const featured = useMemo(() => {
    if (!theses?.length) return [];

    const isOngoing = (s) => s === "In Progress";

    const parseMonthYear = (str) => {
      if (!str) return 0;
      const d = new Date(str);
      const t = d.getTime();
      return Number.isFinite(t) ? t : 0;
    };

    const score = (t) => {
      const status = t.status;
      if (isOngoing(status)) return Number.MAX_SAFE_INTEGER - 1;

      const byDuration = parseMonthYear(t.duration_end);
      if (byDuration) return byDuration;

      const byUpdated = t.updated_at ? new Date(t.updated_at).getTime() : 0;
      const byCreated = t.created_at ? new Date(t.created_at).getTime() : 0;

      return byUpdated || byCreated || 0;
    };

    return [...theses].sort((a, b) => score(b) - score(a)).slice(0, 8);
  }, [theses]);

  const openThesis = (t) => {
    const id = t.id || t._id || t.title;
    navigate(`/theses/${id}`);
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

    const gap = 16;
    return cardWidth + gap;
  };

  const updateProgress = () => {
    const el = rowRef.current;
    if (!el) return;

    const step = getCardStep();
    const idx = Math.round(el.scrollLeft / step);

    setActiveIndex(idx);

    const max = Math.max(
      0,
      Math.round((el.scrollWidth - el.clientWidth) / step),
    );
    setMaxIndex(max);
  };

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
    <FeaturedThesesWrap>
      <SectionDiv>
        <Wrap>
          <HeaderRow>
            <SectionHeader
              title="Featured Theses Research"
              subtitle="Swipe or use the arrows to explore recent research and graduate theses across the Department of Computing."
            />
          </HeaderRow>

          {loading ? (
            <LoadingRow>Loading featured theses…</LoadingRow>
          ) : (
            <Row ref={rowRef}>
              {featured.map((t) => (
                <Card
                  data-card="featured"
                  key={t.id || t._id || t.title}
                  onClick={() => openThesis(t)}
                >
                  <Top>
                    <StatusBadge $status={t.status}>{t.status}</StatusBadge>
                    <CornerIcon aria-hidden="true">
                      <FiArrowUpRight />
                    </CornerIcon>
                  </Top>

                  <Title>{t.title}</Title>
                  {/* <Desc>{t.short_description || t.overview}</Desc> */}

                  <Tags>
                    {(t.tags || []).slice(0, 2).map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </Tags>
                </Card>
              ))}
            </Row>
          )}

          <Controls>
            <NavBtn
              type="button"
              onClick={handlePrev}
              disabled={activeIndex === 0}
            >
              <FiChevronLeft />
            </NavBtn>
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

          <ButtonWrap>
            <ETSUButton text="View All Theses" to="/theses" />
          </ButtonWrap>
        </Wrap>
      </SectionDiv>
    </FeaturedThesesWrap>
  );
};

export default FeaturedThesis;

/* ---------------- styles ---------------- */
const FeaturedThesesWrap = styled.div`
  background-color: white !important;
`;
const Wrap = styled.div`
  padding: 2.2rem 0;
  display: grid;
  gap: 1rem;
`;

const LoadingRow = styled.div`
  margin-top: 1.2rem;
  color: rgba(0, 0, 0, 0.65);
`;

const Row = styled.div`
  margin-top: 0.5rem;
  display: flex;
  gap: 1rem;

  overflow-x: auto;
  overflow-y: hidden;
  padding: 0.2rem 0.2rem 0.8rem 0.2rem;

  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;

  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  @media ${media.tablet} {
    gap: 1.2rem;
  }
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
  border-radius: 9px;
  font-weight: 500;
  font-size: 0.78rem;
  display: inline-block;

  background: ${({ $status }) => {
    switch ($status) {
      case "Completed":
        return "rgba(4, 30, 66, 0.08)";
      case "In Progress":
        return "#FFB81C"; // Gold
      default:
        return "rgba(4, 30, 66, 0.08)";
    }
  }};

  color: ${({ $status }) => {
    switch ($status) {
      case "Completed":
        return "#003b7f";
      case "In Progress":
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
        case "In Progress":
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
  font-weight: 300;
  font-size: 0.78rem;
`;

const ButtonWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;
