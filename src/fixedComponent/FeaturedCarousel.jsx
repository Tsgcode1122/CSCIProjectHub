import React, { useMemo, useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FiArrowUpRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import SectionDiv from "./SectionDiv";
import SectionHeader from "./SectionHeader";
import { Colors, Shadows } from "../theme/Colors";
import { media } from "../theme/Breakpoints";
import ETSUButton from "./ETSUButton";

const FeaturedCarousel = ({
  title,
  subtitle,
  data = [],
  loading,
  viewAllLink,
  viewAllText,
  basePath, // e.g., "/projects" or "/theses"
}) => {
  const navigate = useNavigate();
  const rowRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);

  // Sorting Logic (Shared)
  const sortedData = useMemo(() => {
    if (!data?.length) return [];

    return (
      [...data]
        .sort((a, b) => {
          // We use created_at (or item.created_at) for recency
          const dateA = new Date(a.created_at || 0).getTime();
          const dateB = new Date(b.created_at || 0).getTime();

          // Sort descending (Newest first)
          return dateB - dateA;
        })
        // Limit to exactly 5 items
        .slice(0, 5)
    );
  }, [data]);

  const getCardStep = () => {
    const el = rowRef.current;
    if (!el) return 320;
    const firstCard = el.querySelector("[data-card='carousel-item']");
    const cardWidth = firstCard?.getBoundingClientRect().width || 320;
    return cardWidth + 16;
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
  }, [sortedData.length]);

  const scrollToIndex = (idx) => {
    const el = rowRef.current;
    if (!el) return;
    const step = getCardStep();
    el.scrollTo({ left: idx * step, behavior: "smooth" });
  };

  return (
    <SectionDiv>
      <Wrap>
        <HeaderRow>
          <SectionHeader title={title} subtitle={subtitle} />
        </HeaderRow>

        {loading ? (
          <LoadingRow>Loading items...</LoadingRow>
        ) : (
          <Row ref={rowRef}>
            {sortedData.map((item) => (
              <Card
                data-card="carousel-item"
                key={item.id || item._id}
                onClick={() => navigate(`${basePath}/${item.id || item._id}`)}
              >
                <Top>
                  <StatusBadge $status={item.project_status || item.status}>
                    {item.project_status || item.status}
                  </StatusBadge>
                  <CornerIcon>
                    <FiArrowUpRight />
                  </CornerIcon>
                </Top>
                <Title>{item.title}</Title>
                <Tags>
                  {(item.tags || [])
                    .filter((tag) => tag.trim().split(/\s+/).length <= 2)
                    .slice(0, 2)
                    .map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                </Tags>
              </Card>
            ))}
          </Row>
        )}

        <Controls>
          <NavBtn
            onClick={() => scrollToIndex(activeIndex - 1)}
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
            onClick={() => scrollToIndex(activeIndex + 1)}
            disabled={activeIndex === maxIndex}
          >
            <FiChevronRight />
          </NavBtn>
        </Controls>
        <ButtonWrap>
          <ETSUButton text={viewAllText} to={viewAllLink} />
        </ButtonWrap>
      </Wrap>
    </SectionDiv>
  );
};

export default FeaturedCarousel;

/* Use your existing styles here (Wrap, Row, Card, Title, etc.) */
const Wrap = styled.div`
  padding: 2.2rem 0;
`;
const Row = styled.div`
  margin-top: 1.4rem;
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding: 1rem 0.5rem 1.5rem 2rem;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  &::after {
    content: "";
    flex: 0 0 2rem;
  }
`;
const Card = styled.div`
  flex: 0 0 auto;
  width: 320px;
  background: ${Colors.white};
  border: 1px solid rgba(4, 30, 66, 0.12);
  border-radius: 16px;
  padding: 1.2rem;
  cursor: pointer;
  scroll-snap-align: start;
  transition: all 160ms ease;
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${Shadows.medium};
  }
  @media ${media.tablet} {
    width: 360px;
  }
`;
const Title = styled.h5`
  margin: 0;
  color: ${Colors.brightBlue};
  font-weight: 400;
  line-height: 1.5rem;
  min-height: 4.35rem;
`;
// ... (Add StatusBadge, Tags, Tag, Controls, NavBtn, Dots, Dot styles from your code)
const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
`;
const LoadingRow = styled.div`
  padding: 2rem;
  text-align: center;
`;
const ButtonWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;
const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.7rem;
`;

const CornerIcon = styled.div`
  color: ${Colors.etsuBlue};
`;
const StatusBadge = styled.span`
  width: fit-content;

  padding: 0.35rem 0.6rem;

  right: 0rem;

  border-radius: 9px;

  font-weight: 500;

  font-size: 0.78rem;

  display: inline-block;

  position: relative !important;

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
const Tags = styled.div`
  margin-top: 0.75rem;
  display: flex;
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
const Controls = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
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
  gap: 0.5rem;
`;
const Dot = styled.div`
  width: ${({ $active }) => ($active ? "18px" : "8px")};
  height: 8px;
  border-radius: 4px;
  background: ${({ $active }) => ($active ? Colors.etsuGold : "#ccc")};
  transition: all 0.2s;
`;
