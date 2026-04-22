import React from "react";

import { useThesesContext } from "../context/ThesesContext";

import FeaturedCarousel from "../fixedComponent/FeaturedCarousel";

import styled from "styled-components";

const FeaturedThesis = () => {
  const { theses, loading } = useThesesContext();

  return (
    <>
      <FeaturedThesesWrap>
        <FeaturedCarousel
          title="Featured Theses Research"
          subtitle="Explore recent research and graduate theses across the Department."
          data={theses}
          loading={loading}
          viewAllLink="/theses"
          viewAllText="View All Theses"
          basePath="/theses"
        />
      </FeaturedThesesWrap>
    </>
  );
};

export default FeaturedThesis;

const FeaturedThesesWrap = styled.div`
  background-color: white !important;
`;
