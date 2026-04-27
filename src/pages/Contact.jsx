import React from "react";
import styled from "styled-components";
import ContactUs from "../components/ContactUs";
import PageHeader from "../fixedComponent/PageHeader";

const Contact = () => {
  return (
    <>
      <PageHeader
        title="Contact Us"
        subtitle="Have a question or want to learn more? We'd love to hear from you."
        backLabel="back"
      />

     
      <SpacingWrapper>
        <ContactUs hideHeader={true} />
      </SpacingWrapper>
    </>
  );
};

export default Contact;

// ---------------- styles ----------------

const SpacingWrapper = styled.div`
  
  margin: 0 0 4rem 0;

  
  @media (max-width: 768px) {
    margin: 0 0 2rem 0;
  }
`;
