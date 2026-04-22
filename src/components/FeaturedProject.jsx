import React from "react";
import { useProjectContext } from "../context/ProjectContext";
import FeaturedCarousel from "../fixedComponent/FeaturedCarousel";

const FeaturedProject = () => {
  const { projects, loading } = useProjectContext();

  return (
    <FeaturedCarousel
      title="Featured Capstone Projects"
      subtitle="Explore recent projects across the Department of Computing."
      data={projects}
      loading={loading}
      viewAllLink="/projects"
      viewAllText="View All Projects"
      basePath="/projects"
    />
  );
};
export default FeaturedProject;
