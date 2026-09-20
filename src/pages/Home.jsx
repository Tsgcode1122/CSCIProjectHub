import React from "react";
import Hero from "../components/Hero";
import ProgramEntryPoints from "../components/ProgramEntryPoints";
import ContactUs from "../components/ContactUs";
import FeaturedProject from "../components/FeaturedProject";
import FeaturedThesis from "../components/FeaturedThesis";

const Home = () => {
  // Keep the landing page sections in their reading order.
  return (
    <>
      <Hero />
      <ProgramEntryPoints />
      <FeaturedProject />
      <FeaturedThesis />
      <ContactUs />
    </>
  );
};

export default Home;
