import React, { useEffect } from "react";

import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

import Footer from "./Footer";
import ScrollToTopButton from "./ScrollToTopButton";

const Layout = () => {
  const location = useLocation();

  useEffect(() => {
    // Start each route at the top of the page.
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [location.pathname]);

  return (
    // Shared public shell: navigation, route content, utility, and footer.
    <>
      <Navbar />
      <Outlet />
      <ScrollToTopButton />
      <Footer />
    </>
  );
};

export default Layout;
