import React from "react";
import styled from "styled-components";
import PageHeader from "../fixedComponent/PageHeader";
import SectionDiv from "../fixedComponent/SectionDiv";
import { Colors, Shadows } from "../theme/Colors";
import { media } from "../theme/Breakpoints";
import { FiTarget, FiMonitor, FiUsers, FiAward } from "react-icons/fi";
import SectionHeader from "../fixedComponent/SectionHeader";

const About = () => {
  return (
    <>
      <PageHeader
        title="About the Portal"
        subtitle="Learn more about the purpose, goals, and the team behind the Department of Computing project repository."
        backLabel="back"
      />

      <SectionDiv>
        <PageWrap>
          {/* TOP SECTION: Project Overview */}
          <OverviewSection>
            <TextCol>
              <LeadText>
                This platform was developed as a comprehensive Capstone Project
                for the Department of Computing. It serves as a centralized,
                searchable repository designed to showcase the innovative
                software projects, academic research, and graduate theses
                produced by our students and faculty.
              </LeadText>
              <Paragraph>
                Before this portal, discovering past projects or finding
                inspiration for new research meant navigating disjointed
                systems. Our goal was to build a unified experience where future
                students, faculty advisors, and industry partners can easily
                explore the department's legacy of technical excellence.
              </Paragraph>
            </TextCol>

            {/* QUICK STATS / INFO BOX */}
            <InfoBox>
              <InfoTitle>Project Details</InfoTitle>
              <InfoList>
                <InfoItem>
                  <FiAward />
                  <div>
                    <strong>Capstone Project</strong>
                    <span>Department of Computing</span>
                  </div>
                </InfoItem>
                <InfoItem>
                  <FiMonitor />
                  <div>
                    <strong>Tech Stack</strong>
                    <span>React, Styled-Components, Python</span>
                  </div>
                </InfoItem>
                <InfoItem>
                  <FiTarget />
                  <div>
                    <strong>Status</strong>
                    <span>In Development</span>
                  </div>
                </InfoItem>
              </InfoList>
            </InfoBox>
          </OverviewSection>

          {/* BOTTOM SECTION: The Team */}
          <Divider />

          <TeamSection>
            <SectionHeader
              title="Meet the Team"
              subtitle="The dedicated capstone group and faculty advisor who brought this
              platform to life."
            />

            {/* 3-COLUMN TEAM GRID */}
            <TeamGrid>
              {/* CARD 1: FRONTEND */}
              <RoleCard>
                <IconWrapper>
                  <FiMonitor />
                </IconWrapper>
                <RoleTitle>Frontend Team</RoleTitle>
                <DetailHighlight>UI & Content Management</DetailHighlight>
                <CardDivider />
                <RoleDetails>
                  <DetailText>Joshua</DetailText>
                  <DetailText>Tosin</DetailText>
                </RoleDetails>
              </RoleCard>

              {/* CARD 2: BACKEND */}
              <RoleCard>
                <IconWrapper>
                  <FiTarget />
                </IconWrapper>
                <RoleTitle>Backend Team</RoleTitle>
                <DetailHighlight>Server & Environment</DetailHighlight>
                <CardDivider />
                <RoleDetails>
                  <DetailText>Liz</DetailText>
                  <DetailText>Hassan</DetailText>
                </RoleDetails>
              </RoleCard>

              {/* CARD 3: SUPERVISOR */}
              <RoleCard>
                <IconWrapper>
                  <FiAward />
                </IconWrapper>
                <RoleTitle>Supervisor</RoleTitle>
                <DetailHighlight>Project Supervisor</DetailHighlight>
                <CardDivider />
                <RoleDetails>
                  <DetailText>Rezwana Tahsin</DetailText>
                </RoleDetails>
              </RoleCard>
            </TeamGrid>
          </TeamSection>
        </PageWrap>
      </SectionDiv>
    </>
  );
};

export default About;

// ---------------- styles ----------------

const PageWrap = styled.div`
  padding: 1rem 0 4rem 0;
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  gap: 3.5rem;
`;

const OverviewSection = styled.div`
  display: grid;
  gap: 2.5rem;

  @media ${media.laptop} {
    grid-template-columns: 1.5fr 1fr;
    gap: 4rem;
    align-items: start;
  }
`;

const TextCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const LeadText = styled.p`
  margin: 0;
  /* font-size: 1.15rem; */
  line-height: 1.6;
`;

const Paragraph = styled.p`
  margin: 0;
  line-height: 1.7;
`;

const InfoBox = styled.div`
  background: rgba(4, 30, 66, 0.03);
  border: 1px solid rgba(4, 30, 66, 0.1);
  border-radius: 16px;
  padding: 1.8rem;
`;

const InfoTitle = styled.h5`
  margin: 0 0 1.5rem 0;
  color: ${Colors.etsuBlue};
`;

const InfoList = styled.div`
  display: grid;
  gap: 1.4rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;

  svg {
    font-size: 1.4rem;
    color: ${Colors.etsuGold};
    margin-top: 0.1rem;
  }

  div {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;

    strong {
      color: ${Colors.etsuBlue};
      font-size: 0.95rem;
    }

    span {
      color: rgba(0, 0, 0, 0.65);
      font-size: 0.9rem;
    }
  }
`;

const Divider = styled.div`
  height: 1px;
  background: rgba(4, 30, 66, 0.1);
  width: 100%;
`;

const TeamSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Subtitle = styled.p`
  margin: 0 0 1rem 0;
  color: rgba(0, 0, 0, 0.65);
  font-size: 1.05rem;
`;

/* --- WIDE DEPARTMENT CARD --- */
const WideCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${Colors.etsuBlue};
  color: ${Colors.white};
  border-radius: 16px;
  padding: 2rem 2.5rem;
  box-shadow: ${Shadows.medium};
  margin-bottom: 0.5rem;
`;

const WideCardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const WideCardTitle = styled.h3`
  margin: 0;
  font-weight: 500;
  font-size: 1.5rem;
  letter-spacing: 0.02em;
  color: ${Colors.white};
`;

const WideCardSub = styled.span`
  color: rgba(255, 255, 255, 0.75);
  font-size: 1rem;
`;

const WideCardIcon = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: rgba(255, 255, 255, 0.9);

  @media (max-width: 600px) {
    display: none;
  }
`;

/* --- 3-COLUMN GRID --- */
const TeamGrid = styled.div`
  display: grid;
  gap: 1.5rem;

  @media ${media.tablet} {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const RoleCard = styled.div`
  background: ${Colors.white};
  border: 1px solid rgba(4, 30, 66, 0.12);
  border-radius: 16px;
  padding: 2.5rem 1.5rem;
  box-shadow: ${Shadows.light};

  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  transition:
    transform 160ms ease,
    box-shadow 160ms ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${Shadows.medium};
  }
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${Colors.etsuGold};
  color: ${Colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.4rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px rgba(255, 184, 28, 0.3);
`;

const RoleTitle = styled.h4`
  margin: 0;
  color: ${Colors.etsuGold};
  font-size: 1.4rem;
  font-weight: 600;
`;

const RoleSubtitle = styled.div`
  margin-top: 0.4rem;
  color: rgba(0, 0, 0, 0.55);
  font-size: 0.95rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const CardDivider = styled.div`
  width: 100%;
  height: 1px;
  background: rgba(4, 30, 66, 0.08);
  margin: 1.5rem 0;
`;

const RoleDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  width: 100%;
`;

const DetailHighlight = styled.div`
  color: ${Colors.etsuBlue};
  font-weight: 600;
  font-size: 1.05rem;
  margin-bottom: 0.2rem;
`;

const DetailText = styled.div`
  color: rgba(0, 0, 0, 0.7);
  font-size: 0.95rem;
  line-height: 1.4;
`;
