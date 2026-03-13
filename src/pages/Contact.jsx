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

      {/* Wrap the component to apply page-specific spacing */}
      <SpacingWrapper>
        <ContactUs hideHeader={true} />
      </SpacingWrapper>
    </>
  );
};

export default Contact;

// ---------------- styles ----------------

const SpacingWrapper = styled.div`
  /* 4rem top and bottom, 0 on the sides. Adjust the 4rem as needed! */
  margin: 0 0 4rem 0;

  /* Optional: If you want it a bit tighter on mobile screens */
  @media (max-width: 768px) {
    margin: 0 0 2rem 0;
  }
`;
