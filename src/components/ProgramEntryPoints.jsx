import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Colors, Shadows } from "../theme/Colors";
import SectionDiv from "../fixedComponent/SectionDiv";
import { FiArrowUpRight } from "react-icons/fi";

import { HiOutlineDesktopComputer } from "react-icons/hi"; // CS
import { LuComputer } from "react-icons/lu"; // IT
import { FaComputer } from "react-icons/fa6"; // IS
import { RiShieldKeyholeLine } from "react-icons/ri"; // Cybersecurity
import { IoBarChartOutline } from "react-icons/io5"; // Data Science
import { media } from "../theme/Breakpoints";

const ProgramEntryPoints = () => {
  const navigate = useNavigate();

  const programs = [
    {
      key: "cs",
      label: "Computer Science",
      icon: <HiOutlineDesktopComputer />,
      path: "/projects",
    },
    {
      key: "it",
      label: "Information Technology",
      icon: <LuComputer />,
      path: "/projects",
    },
    {
      key: "is",
      label: "Information Systems",
      icon: <FaComputer />,
      path: "/projects",
    },
    {
      key: "cybersecurity",
      label: "Cybersecurity",
      icon: <RiShieldKeyholeLine />,
      path: "/theses",
    },
    {
      key: "datascience",
      label: "Data Science",
      icon: <IoBarChartOutline />,
      path: "/theses",
    },
  ];

  const handleNavigate = (program) => {
    navigate(`${program.path}?department=${encodeURIComponent(program.label)}`);
  };

  return (
    <ProgramWrap>
      <SectionDiv>
        <Wrapper>
          <ScrollRow>
            {programs.map((program) => (
              <Card key={program.key} onClick={() => handleNavigate(program)}>
                <Arrow>
                  <FiArrowUpRight />
                </Arrow>
                {/* 3. Render the icon component directly */}
                <Icon>{program.icon}</Icon>
                <Label>{program.label}</Label>
              </Card>
            ))}
          </ScrollRow>
        </Wrapper>
      </SectionDiv>
    </ProgramWrap>
  );
};
export default ProgramEntryPoints;

const ProgramWrap = styled.div`
  background-color: white !important;
`;

const Wrapper = styled.div`
  display: grid;
  gap: 1.2rem;
  margin-bottom: 2rem;
`;
const Arrow = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  background: rgba(4, 30, 66, 0.06);
  color: ${Colors.etsuBlue};
  font-size: 1rem;
  opacity: 0.6;
  transform: translateY(2px);
  transition:
    opacity 160ms ease,
    transform 160ms ease,
    background 160ms ease;
`;

const ScrollRow = styled.div`
  display: flex;
  gap: 0.9rem;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0 0.5rem 0.2rem 1rem;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  justify-content: flex-start;

  @media (min-width: 1080px) {
    justify-content: safe center;
  }
`;
const Card = styled.button`
  position: relative;
  flex: 0 0 auto;
  min-width: 160px;
  padding: 1.1rem 1rem;
  border-radius: 14px;
  border: 1px solid rgba(4, 30, 66, 0.14);
  background: ${Colors.white};
  box-shadow: ${Shadows.light};
  cursor: pointer;
  display: grid;
  place-items: center;
  gap: 0.55rem;
  scroll-snap-align: start;
  transition:
    transform 160ms ease,
    box-shadow 160ms ease,
    border-color 160ms ease;

  &:hover {
    transform: translateX(0.02px);
    box-shadow: ${Shadows.medium};
    border-color: rgba(4, 30, 66, 0.28);
  }

  &:hover ${Arrow} {
    opacity: 1;
    transform: translateX(0.02);
    background: rgba(255, 184, 28, 0.25);
  }

  &:active {
    transform: translateX(0.02);
  }
`;

const Icon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(4, 30, 66, 0.06);
  color: ${Colors.etsuBlue};
  display: grid;
  place-items: center;

  font-size: 1.5rem;

  svg {
    display: block;
  }
`;
const Label = styled.small`
  color: ${Colors.etsuBlue};
  font-weight: 600;
  text-align: center;
  line-height: 1.15rem;
  @media ${media.mobileXS} {
    font-size: 0.9rem;
    line-height: 1.5rem;
  }
  @media ${media.mobileS} {
    font-size: 1rem;
    line-height: 1.5rem;
  }
  @media ${media.tablet} {
    font-size: 1.05rem;
    line-height: 1.3rem;
  }
  @media ${media.laptop} {
    font-size: 1.15rem;
    line-height: 1.7rem;
  }
`;
