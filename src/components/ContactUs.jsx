import React, { useState } from "react";
import styled from "styled-components";
import SectionDiv from "../fixedComponent/SectionDiv";
import SectionHeader from "../fixedComponent/SectionHeader";
import { FiArrowRight, FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { Colors, Shadows } from "../theme/Colors";
import { media } from "../theme/Breakpoints";
import { Form, Input, Button, message } from "antd";

const { TextArea } = Input;

// 1. Pass hideHeader as a prop, defaulting to false
const ContactUs = ({ hideHeader = false }) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onFinish = async (values) => {
    try {
      setIsSubmitting(true);

      // await axios.post("/api/contact", values);

      console.log("Contact form payload:", values);

      message.success("Message sent. We’ll get back to you soon.");
      form.resetFields();
    } catch (err) {
      message.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SectionDiv>
      <Wrap>
        {/* 2. Conditionally render the header based on the prop */}
        {!hideHeader && (
          <SectionHeader
            title="Contact Us"
            subtitle="Have questions about our research projects or want to collaborate? We’d love to hear from you."
          />
        )}

        <Grid>
          <FormCard>
            <StyledForm form={form} layout="vertical" onFinish={onFinish}>
              <TwoCol>
                <Form.Item name="name" label="Your Name (optional)">
                  <StyledInput placeholder="Enter your name" />
                </Form.Item>

                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: "Email is required." },
                    { type: "email", message: "Enter a valid email address." },
                  ]}
                >
                  <StyledInput placeholder="you@example.com" />
                </Form.Item>
              </TwoCol>
              <Form.Item
                name="comment"
                label="Comment"
                rules={[{ required: true, message: "Comment is required." }]}
              >
                <StyledTextArea
                  placeholder="Tell us how we can help..."
                  rows={6}
                />
              </Form.Item>

              <ButtonRow>
                <SubmitBtn
                  type="primary"
                  htmlType="submit"
                  loading={isSubmitting}
                >
                  Send
                  <FiArrowRight size={18} />
                </SubmitBtn>
              </ButtonRow>
            </StyledForm>
          </FormCard>

          <InfoCol>
            <InfoCard>
              <Icon>
                <FiMail />
              </Icon>
              <InfoText>
                <InfoValue>
                  <a href="mailto:research@etsu.edu">research@etsu.edu</a>
                </InfoValue>
              </InfoText>
            </InfoCard>

            <InfoCard>
              <Icon>
                <FiPhone />
              </Icon>
              <InfoText>
                <InfoValue>
                  <a href="tel:+14234391000">(423) 439-1000</a>
                </InfoValue>
              </InfoText>
            </InfoCard>

            <InfoCard>
              <Icon>
                <FiMapPin />
              </Icon>
              <InfoText>
                <InfoValue>
                  Nicks Hall, 365 Stout Dr #132 Johnson City, TN 37604
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

// ---------------- styles ----------------

const Wrap = styled.div`
  padding: 3rem 0;
  max-width: 1400px;
  margin: 0 auto;
`;

const Grid = styled.div`
  margin-top: 2.5rem;
  display: grid;
  gap: 1.6rem;

  @media ${media.tablet} {
    grid-template-columns: 1.35fr 0.65fr;
    align-items: start;
  }
`;

const FormCard = styled.div`
  background: ${Colors.white};
  border: 1px solid rgba(4, 30, 66, 0.12);
  border-radius: 16px;
  padding: 1.8rem 1.6rem;
`;

const StyledForm = styled(Form)`
  .ant-form-item-label > label {
    font-weight: 600;
    color: ${Colors.etsuBlue};
  }

  .ant-form-item-explain-error {
    font-weight: 600;
  }
`;

const TwoCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media ${media.tablet} {
    flex-direction: row;

    > * {
      flex: 1;
    }
  }
`;

const StyledInput = styled(Input)`
  border-radius: 12px !important;
  padding: 0.85rem 0.95rem !important;
  border: 1px solid rgba(4, 30, 66, 0.18) !important;
`;

const StyledTextArea = styled(TextArea)`
  border-radius: 12px !important;
  padding: 0.85rem 0.95rem !important;
  border: 1px solid rgba(4, 30, 66, 0.18) !important;
`;

const ButtonRow = styled.div`
  margin-top: 0.4rem;
`;

const SubmitBtn = styled(Button)`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;

  padding: 1rem 1.6rem !important;
  cursor: pointer;
  @media ${media.mobileXS} {
    padding: 0.5rem 1rem !important;
  }
  background: ${Colors.etsuGold} !important;
  color: ${Colors.etsuBlue} !important;

  font-weight: 600 !important;
  letter-spacing: 0.02em !important;

  border: none !important;
  border-radius: 10px !important;
  box-shadow: ${Shadows.medium} !important;

  transition:
    transform 160ms ease,
    box-shadow 160ms ease !important;

  &:hover {
    transform: translateY(-0.02px) !important;
    box-shadow: ${Shadows.heavy} !important;
  }

  &:active {
    transform: translateY(0) !important;
    box-shadow: ${Shadows.medium} !important;
  }

  svg {
    transition: transform 160ms ease !important;
  }

  &:hover svg {
    transform: translateX(4px) !important;
  }
`;

/* RIGHT SIDE INFO */
const InfoCol = styled.div`
  display: grid;
  gap: 1.1rem;
`;

const InfoCard = styled.div`
  display: flex;
  gap: 0.9rem;
  padding: 1.2rem 1.1rem;

  background: ${Colors.white};
  border-radius: 14px;
  border: 1px solid rgba(4, 30, 66, 0.12);
`;

const Icon = styled.div`
  color: ${Colors.etsuGold};
  font-size: 1.25rem;
  margin-top: 0.2rem;
`;

const InfoText = styled.div``;

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
