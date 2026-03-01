// import React from "react";
// import { Outlet } from "react-router-dom";
// import { useAdminAuth } from "./AdminAuthContext";
// import {
//   Page,
//   Sidebar,
//   Shell,
//   Topbar,
//   Brand,
//   Content,
//   SideTitle,
//   SideLink,
//   Button,
// } from "./styles";

// export default function AdminLayout() {
//   const { logout } = useAdminAuth();

//   return (
//     <Page>
//       <Sidebar>
//         <Brand style={{ padding: "8px 8px 14px" }}>Admin</Brand>

//         <SideTitle>Manage</SideTitle>
//         <SideLink to="/admin/projects">Projects</SideLink>
//         <SideLink to="/admin/users">Users</SideLink>

//         <div style={{ marginTop: 18, padding: 8 }}>
//           <Button onClick={logout}>Logout</Button>
//         </div>
//       </Sidebar>

//       <Shell>
//         <Topbar>
//           <Brand>Admin Dashboard</Brand>
//         </Topbar>

//         <Content>
//           <Outlet />
//         </Content>
//       </Shell>
//     </Page>
//   );
// }


import React, { useEffect } from "react";
import { Outlet, NavLink, Link } from "react-router-dom";
import styled from "styled-components";
import { useAdminAuth } from "./AdminAuthContext";

const ETSU_NAVY = "#041E42";
const ETSU_GOLD = "#FFC72C";
const BG = "#F3F4F6";
const BORDER = "#E5E7EB";

const TOPBAR_H = 76;

export default function AdminLayout() {
  const { logout } = useAdminAuth();

  // ✅ Prevent layout “jank” from scrollbar showing/hiding
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevGutter = html.style.scrollbarGutter;

    // Make the APP layout control scrolling, not the browser window.
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    // Reserve scrollbar space inside the scroll container (modern browsers)
    html.style.scrollbarGutter = "stable";

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      html.style.scrollbarGutter = prevGutter;
    };
  }, []);

  return (
    <Shell>
      {/* TOP NAVBAR (fixed, never moves) */}
      <TopBar>
        <TopInner>
          <TopLeft>
            <LogoCircle>Ξ</LogoCircle>

            <div>
              <TopTitle>Dashboard</TopTitle>
              <TopSubtitle>Project &amp; Thesis Management System</TopSubtitle>
            </div>
          </TopLeft>

          <TopRight>
            <PublicLink to="/">← Public Site</PublicLink>
          </TopRight>
        </TopInner>
      </TopBar>

      {/* BODY fills the remaining viewport height */}
      <Body>
        {/* SIDEBAR is fixed/stable */}
        <Side>
          <NavGroup>
            <SideLink to="/admin/projects">Projects</SideLink>
            <SideLink to="/admin/users">Users</SideLink>
          </NavGroup>

          <SideBottom>
            <LogoutBtn type="button" onClick={logout}>
              Logout
            </LogoutBtn>
          </SideBottom>
        </Side>

        {/* MAIN is the ONLY scroll container */}
        <Main>
          <MainInner>
            <Outlet />
          </MainInner>
        </Main>
      </Body>
    </Shell>
  );
}

/* ---------- Shell: fixed top, fixed sidebar, scroll main only ---------- */

const Shell = styled.div`
  height: 100dvh;
  width: 100%;
  max-width: 100%;
  background: ${BG};
  display: flex;
  flex-direction: column;

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  overflow-x: hidden;
`;

const TopBar = styled.header`
  height: ${TOPBAR_H}px;
  background: linear-gradient(180deg, ${ETSU_NAVY} 0%, #031733 100%);
  color: white;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.22);
  z-index: 10;
  flex: 0 0 auto;
`;

const TopInner = styled.div`
  height: 100%;
  padding: 0 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TopLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const LogoCircle = styled.div`
  width: 46px;
  height: 46px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: ${ETSU_GOLD};
  color: ${ETSU_NAVY};
  font-weight: 900;
  box-shadow: 0 10px 18px rgba(0, 0, 0, 0.25);
`;

const TopTitle = styled.div`
  font-size: 18px;
  font-weight: 850;
  letter-spacing: -0.02em;
  line-height: 1.05;
`;

const TopSubtitle = styled.div`
  margin-top: 5px;
  font-size: 13px;
  color: ${ETSU_GOLD};
  font-weight: 650;
  letter-spacing: 0.01em;
`;

const TopRight = styled.div`
  display: flex;
  align-items: center;
`;

const PublicLink = styled(Link)`
  color: rgba(255, 255, 255, 0.9);
  font-weight: 700;
  text-decoration: none;
  font-size: 13px;

  &:hover {
    color: white;
    text-decoration: underline;
  }
`;

const Body = styled.div`
  flex: 1 1 auto;
  min-height: 0; /* required for scroll container */
  display: grid;
  grid-template-columns: 260px 1fr;
  overflow: hidden; /* stops any inner overflow from causing page scroll */
`;

/* ---------- Sidebar ---------- */

const Side = styled.aside`
  background: #ffffff;
  border-right: 1px solid ${BORDER};

  display: flex;
  flex-direction: column;

  /* fixed height and no scrolling */
  min-height: 0;
  overflow: hidden;

  padding: 18px 14px 14px;
`;

const NavGroup = styled.nav`
  display: grid;
  gap: 10px;
  padding-top: 8px;
`;


const SideLink = styled(NavLink)`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;

  padding: 16px 14px 16px 18px;
  border-radius: 14px;

  text-decoration: none;
  color: ${ETSU_NAVY};
  font-weight: 800;
  font-size: 14px;
  letter-spacing: -0.01em;

  background: transparent;
  border: 1px solid transparent;

  &:hover {
    background: rgba(4, 30, 66, 0.04);
  }

  &.active {
    background: rgba(4, 30, 66, 0.06);
    border-color: rgba(4, 30, 66, 0.12);
  }

  &.active::before {
    content: "";
    position: absolute;
    left: 8px; /* ✅ inside pill, not on sidebar border */
    top: 10px;
    bottom: 10px;
    width: 4px;
    border-radius: 999px;
    background: ${ETSU_GOLD};
  }
`;

const SideBottom = styled.div`
  margin-top: auto;
  padding-top: 14px;
  border-top: 1px solid ${BORDER};
`;

const LogoutBtn = styled.button`
  width: 100%;
  background: ${ETSU_NAVY};
  color: white;
  border: none;
  font-weight: 900;
  padding: 12px 14px;
  border-radius: 14px;
  cursor: pointer;

  &:hover {
    filter: brightness(0.95);
  }
`;

/* ---------- Main (ONLY scroll area) ---------- */

const Main = styled.main`
  background: ${BG};
  min-height: 0;
//   overflow: auto;

  overflow: hidden;
`;

const MainInner = styled.div`
  width: 100%;
  padding: 22px 28px 32px;
  max-width: 1600px;
  margin: 0;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
`;