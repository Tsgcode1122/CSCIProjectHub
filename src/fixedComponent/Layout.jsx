import React, { useEffect } from "react";

import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

import Footer from "./Footer";
import ScrollToTopButton from "./ScrollToTopButton";

const Layout = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  });
  const location = useLocation();

  return (
    <>
      <Navbar />
      <Outlet />
      <ScrollToTopButton />
      <Footer />
    </>
  );
};

export default Layout;
