import React from "react";
import styled from "styled-components";
import { Colors, Shadows } from "../../theme/Colors";
import { media } from "../../theme/Breakpoints";
import { FiUser, FiCalendar, FiArrowUpRight } from "react-icons/fi";

const ThesisCardItem = ({ thesis, onOpen, variant }) => {
  const id = thesis?.id || thesis?._id || thesis?.title; // Fallback to title if no ID is present

  return (
    <>
      <ThesisCard $variant={variant} onClick={() => onOpen?.(id)}>
        <TitleRow>
          <CardTitle $variant={variant}>{thesis.title}</CardTitle>
          <StatusBadge $status={thesis.status}>{thesis.status}</StatusBadge>
        </TitleRow>

        <CardContent>
          <TopRow>
            <Tags>
              {(thesis.tags || []).slice(0, 4).map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </Tags>

            {/* Fallback to overview if short_description is missing */}
            <MiniDesc>{thesis.short_description || thesis.overview}</MiniDesc>

            <MetaRow>
              <MetaItem>
                <FiUser />
                <span>{thesis.student || "Student"}</span>
              </MetaItem>

              <MetaItem>
                <FiCalendar />
                <span>
                  {thesis.duration_start || "—"} –{" "}
                  {thesis.status === "In Progress"
                    ? "Ongoing"
                    : thesis.duration_end || "—"}
                </span>
              </MetaItem>

              <MetaRight>
                <CornerIcon aria-hidden="true">
                  <FiArrowUpRight />
                </CornerIcon>
              </MetaRight>
            </MetaRow>
          </TopRow>
        </CardContent>
      </ThesisCard>
    </>
  );
};

export default ThesisCardItem;

// ---------------- styles ----------------

const ThesisCard = styled.button`
  width: 100%;
  border: none;
  text-align: left;
  cursor: pointer;
  position: relative;
  gap: 1rem;
  margin: 0;
  padding: 0;
  background: ${Colors.white};
  border-radius: 16px;
  border: 1px solid rgba(132, 172, 227, 0.306);

  transition:
    transform 160ms ease,
    box-shadow 160ms ease,
    border-color 160ms ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${Shadows.light};
    border-color: rgba(177, 178, 179, 0.22);
  }

  @media ${media.mobileS} {
    grid-template-columns: 120px 1fr;
  }

  @media ${media.tablet} {
    grid-template-columns: 140px 1fr;
    gap: 1.1rem;
  }
`;

const CardContent = styled.div`
  display: grid;
  gap: 12px;
  padding: 1rem;
  @media ${media.tablet} {
    padding: 1.1rem;
  }
  @media ${media.mobileXS} {
    padding: 1.1rem;
    position: relative;
  }
`;

const TopRow = styled.div`
  gap: 0.8rem;
`;

const TitleRow = styled.div`
  position: relative !important;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  min-width: 0;
  padding: 1rem;
  border-radius: 16px 16px 0 0;
  background: rgba(1, 51, 121, 0.095);
  @media ${media.tablet} {
    padding: 1.1rem;
  }
  @media ${media.mobileS} {
    display: grid;
  }
  @media ${media.mobileXS} {
    display: grid;
  }
`;

const CardTitle = styled.h5`
  margin: 0;
  color: ${({ $variant }) =>
    $variant === "related" ? Colors.etsuGold : Colors.brightBlue};
  font-weight: 500 !important;
  min-width: 0;
  flex: 1;
  max-width: 80%;

  @media ${media.mobileS} {
    max-width: 100%;
  }
  @media ${media.mobileXS} {
    max-width: 100%;
  }
  @media ${media.tablet} {
    max-width: 90%;
  }
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

const CornerIcon = styled.div`
  color: rgba(4, 30, 66, 0.65);
  font-size: 1.15rem;
  margin-top: 0.15rem;
  svg {
    transform: rotate(45deg);
  }
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  @media ${media.mobileS} {
    display: none;
  }
  @media ${media.mobileXS} {
    display: none;
  }
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

const MiniDesc = styled.p`
  margin: 0.65rem 0 0 0;
  color: rgba(0, 0, 0, 0.68);
  line-height: 1.3rem;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const MetaRow = styled.div`
  margin-top: 0.8rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: rgba(0, 0, 0, 0.62);
  font-weight: 600;

  svg {
    color: ${Colors.etsuGold};
  }
`;

const MetaRight = styled.div`
  margin-left: auto;
  color: rgba(0, 0, 0, 0.5);
  @media ${media.mobileXS} {
    position: absolute;
    top: -10px;
    right: 10px;
    transform: rotate(-45deg);
    background: white;
  }
`;
