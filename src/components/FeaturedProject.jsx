import React from "react";
import { useProjectContext } from "../context/ProjectContext";
import FeaturedCarousel from "../fixedComponent/FeaturedCarousel";

const FeaturedProject = () => {
  // The shared carousel receives project data and navigation settings here.
  const { projects, loading, error } = useProjectContext();

  return (
    <FeaturedCarousel
      title="Featured Capstone Projects"
      subtitle="Explore recent projects across the Department of Computing."
      data={projects}
      loading={loading}
      error={error}
      viewAllLink="/projects"
      viewAllText="View All Projects"
      basePath="/projects"
    />
  );
};
export default FeaturedProject;
