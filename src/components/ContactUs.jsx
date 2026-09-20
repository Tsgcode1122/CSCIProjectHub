import React from "react";
import styled from "styled-components";
import SectionDiv from "../fixedComponent/SectionDiv";
import SectionHeader from "../fixedComponent/SectionHeader";
import { FiArrowRight, FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { Colors, Shadows } from "../theme/Colors";
import { media } from "../theme/Breakpoints";

const ContactUs = ({ hideHeader = false }) => {
  // Public contact details shared by the home and contact pages.
  return (
    <SectionDiv>
      <Wrap>
        {!hideHeader && (
          <SectionHeader
            title="Contact Us"
            subtitle="Have questions about our research projects or want to collaborate? We’d love to hear from you."
          />
        )}

        <Grid>
          <InfoCol>
            <InfoCard>
              <Icon>
                <FiMail />
              </Icon>
              <InfoText>
                <InfoValue>
                  <a href="mailto:computing@etsu.edu">computing@etsu.edu</a>
                </InfoValue>
              </InfoText>
            </InfoCard>

            <InfoCard>
              <Icon>
                <FiPhone />
              </Icon>
              <InfoText>
                <InfoValue>
                  <a href="tel:+14234395328">(423) 439-5328</a>
                </InfoValue>
              </InfoText>
            </InfoCard>

            <InfoCard>
              <Icon>
                <FiMapPin />
              </Icon>
              <InfoText>
                <InfoValue>
                  2001 Millennium Pl, Johnson City, TN 37604
                </InfoValue>
              </InfoText>
            </InfoCard>
          </InfoCol>
        </Grid>
      </Wrap>
    </SectionDiv>
  );
};

export default ContactUs;

const Wrap = styled.div`
  padding: 3rem 0;
  max-width: 1400px;
  margin: 0 auto;
`;

const Grid = styled.div`
  margin-top: 2.5rem;
  display: flex;
  gap: 1.6rem;
  justify-content: center;
  align-items: center;
  @media ${media.tablet} {
  }
`;

const InfoCol = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1.1rem;
`;

const InfoCard = styled.div`
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 1.2rem 1.1rem;

  background: ${Colors.white};
  border-radius: 14px;
  border: 1px solid rgba(4, 30, 66, 0.12);

  min-height: 70px;
`;

const Icon = styled.div`
  color: ${Colors.etsuGold};
  font-size: 1.25rem;

  margin-top: 0;

  display: flex;
  align-items: center;
`;

const InfoText = styled.div`
  display: flex;
  align-items: center;
`;

const InfoValue = styled.div`
  color: rgba(0, 0, 0, 0.65);
  line-height: 1.35rem;

  a {
    color: inherit;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`;
