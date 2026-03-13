import React, { useMemo } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import SectionDiv from "../../fixedComponent/SectionDiv";
import BackButton from "../../fixedComponent/BackButton";
import { Colors, Shadows } from "../../theme/Colors";
import { media } from "../../theme/Breakpoints";

import {
  FiExternalLink,
  FiUsers,
  FiCalendar,
  FiUser,
  FiBookOpen,
} from "react-icons/fi";

import { useThesesContext } from "../../context/ThesesContext";
import RelatedThesis from "./RelatedThesis";

const ThesisDetail = () => {
  const navigate = useNavigate();
  const { thesisId } = useParams(); // Updated param name
  const { theses, loading, error } = useThesesContext();

  const thesis = useMemo(() => {
    // Falls back to checking title if id is not available (based on our JSON)
    return theses?.find(
      (t) =>
        String(t.id || t._id) === String(thesisId) ||
        String(t.title) === String(thesisId),
    );
  }, [theses, thesisId]);

  if (loading) return <SectionDiv>Loading thesis...</SectionDiv>;
  if (error) return <SectionDiv>Failed to load thesis: {error}</SectionDiv>;

  if (!thesis) {
    return (
      <SectionDiv>
        <NotFound>
          <h3>Thesis not found</h3>
          <p>The research paper or thesis you are looking for may not exist.</p>

          <PrimaryBtn type="button" onClick={() => navigate("/theses")}>
            Back to Theses
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
            <BackButton label="Back to Theses" />

            <TitleRow>
              <HeaderTitle>{thesis.title}</HeaderTitle>
            </TitleRow>

            {(thesis.tags || []).length > 0 && (
              <TagRow>
                {thesis.tags.slice(0, 4).map((t) => (
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
              <CardTitle>Abstract / Overview</CardTitle>
              <StatusBadge $status={thesis.status}>{thesis.status}</StatusBadge>
            </TitleRow>
            <CardText>{thesis.overview || "—"}</CardText>

            <CardDivider />

            <MiniGrid>
              {/* STUDENT */}
              <MiniItem>
                <MiniIcon>
                  <FiUser />
                </MiniIcon>
                <MiniText>
                  <MiniLabel>Student</MiniLabel>
                  <MiniValue>{thesis.student || "—"}</MiniValue>
                </MiniText>
              </MiniItem>

              {/* SUPERVISOR */}
              <MiniItem>
                <MiniIcon>
                  <FiUsers />
                </MiniIcon>
                <MiniText>
                  <MiniLabel>Supervisor</MiniLabel>
                  <MiniValue>{thesis.supervisor || "—"}</MiniValue>
                </MiniText>
              </MiniItem>

              {/* TIMELINE */}
              <MiniItem>
                <MiniIcon>
                  <FiCalendar />
                </MiniIcon>
                <MiniText>
                  <MiniLabel>Timeline</MiniLabel>
                  <MiniValue>
                    {thesis.duration_start || "—"} –{" "}
                    {thesis.status === "In Progress"
                      ? "Ongoing"
                      : thesis.duration_end || "—"}
                  </MiniValue>
                </MiniText>
              </MiniItem>

              {/* DEPARTMENT */}
              <MiniItem>
                <MiniIcon>
                  <FiBookOpen />
                </MiniIcon>
                <MiniText>
                  <MiniLabel>Department</MiniLabel>
                  <MiniValue>{thesis.department || "—"}</MiniValue>
                </MiniText>
              </MiniItem>
            </MiniGrid>

            {/* PUBLICATIONS (Buttons) */}
            {(thesis.publications || []).length > 0 && (
              <BtnRow>
                {thesis.publications.map((pub, idx) => (
                  <OutlineBtn
                    key={idx}
                    as="a"
                    href={pub.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FiExternalLink />
                    View Publication{" "}
                    {thesis.publications.length > 1 ? idx + 1 : ""}
                  </OutlineBtn>
                ))}
              </BtnRow>
            )}
          </Card>

          {/* METHODOLOGY */}
          {thesis.methodology && (
            <Card>
              <CardTitle>Methodology</CardTitle>
              <CardText>{thesis.methodology}</CardText>
            </Card>
          )}

          {/* KEY FINDINGS */}
          {thesis.key_findings && (
            <Card>
              <CardTitle>Key Findings</CardTitle>
              <CardText>{thesis.key_findings}</CardText>
            </Card>
          )}

          {/* FUTURE WORK */}
          {thesis.future_work && (
            <Card>
              <CardTitle>Future Work</CardTitle>
              <CardText>{thesis.future_work}</CardText>
            </Card>
          )}
        </Body>

        <RelatedThesis currentThesis={thesis} />
      </SectionDiv>
    </>
  );
};

export default ThesisDetail;

/* ---------------- styles ---------------- */

const HeaderWrap = styled.header`
  background: ${Colors.brightBlue};
  color: ${Colors.white};
  padding: 0.2rem 0;
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
  font-weight: 600;
  font-size: 0.78rem;
  display: inline-block;
  position: relative !important;

  background: ${({ $status }) => {
    switch ($status) {
      case "Completed":
        return "rgba(4, 30, 66, 0.08)";
      case "In Progress":
        return "#FFB81C";
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
  font-weight: 500;
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
