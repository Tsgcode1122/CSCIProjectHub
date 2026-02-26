import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import SectionDiv from "../../fixedComponent/SectionDiv";
import { Colors, Shadows } from "../../theme/Colors";
import { media } from "../../theme/Breakpoints";
import {
  FiSearch,
  FiUsers,
  FiCalendar,
  FiArrowUpRight,
  FiFilter,
} from "react-icons/fi";

import { useProjectContext } from "../../context/ProjectContext";

const ProjectCardItem = ({ project, onOpen, variant }) => {
  const id = project?.id || project?._id;
  return (
    <>
      <ProjectCard $variant={variant} onClick={() => onOpen?.(id)}>
        <TitleRow>
          <CardTitle $variant={variant}>{project.title}</CardTitle>
          <StatusBadge $status={project.project_status}>
            {project.project_status}
          </StatusBadge>
        </TitleRow>

        <CardContent>
          <TopRow>
            <Tags>
              {(project.tags || []).slice(0, 4).map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </Tags>

            <MiniDesc>{project.short_description}</MiniDesc>

            <MetaRow>
              <MetaItem>
                <FiUsers />
                <span>{project.team_members?.length ?? 0} members</span>
              </MetaItem>

              <MetaItem>
                <FiCalendar />
                <span>
                  {project.duration_start || "—"} –{" "}
                  {project.project_status === "In Progress" ||
                  project.project_status === "Accepting Members"
                    ? "Ongoing"
                    : project.duration_end || "—"}
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
      </ProjectCard>
    </>
  );
};

export default ProjectCardItem;

const ProjectCard = styled.button`
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
  /* border: 1px solid rgba(4, 30, 66, 0.12); */
  /* box-shadow: ${Shadows.light}; */

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

const Thumb = styled.div`
  border-radius: 14px;
  overflow: hidden;
  background: rgba(4, 30, 66, 0.06);
  border: 1px solid rgba(4, 30, 66, 0.08);

  img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    /* aspect-ratio: 1 / 1; */
  }
`;

const CardContent = styled.div`
  /* min-width: 0; */

  display: grid;
  gap: 12px;
  /* grid-template-columns: 140px 1fr; */
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

  /* overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; */
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

const CornerIcon = styled.div`
  color: rgba(4, 30, 66, 0.65);
  font-size: 1.15rem;
  margin-top: 0.15rem;
  svg {
    transform: rotate(45deg);
  }
`;

const Tags = styled.div`
  /* margin-top: 0.6rem; */
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
    /* display: none; */
    position: absolute;
    top: -10px;
    right: 10px;
    transform: rotate(-45deg);
    background: white;
  }
`;
