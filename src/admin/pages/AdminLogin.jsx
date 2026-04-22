import React, { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { useAdminAuth } from "../AdminAuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function AdminLogin() {
  const nav = useNavigate();
  const { login } = useAdminAuth();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      await login({ email, password });

      // ✅ LOGIC: Get 'next' from URL, or default to '/admin/projects'
      const redirectTo = searchParams.get("next") || "/admin/projects";

      nav(redirectTo, { replace: true });
    } catch (ex) {
      setErr(ex?.message || "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Bg>
      <BackLink to="/">← Back to ETSU Project Hub</BackLink>
      <Card>
        <Header>
          <IconCircle>
            {/* Simple book-like icon */}
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 6v13m0-13C10.8 5.48 9.25 5 7.5 5S4.17 5.48 3 6.25V19c1.17-.77 2.75-1.25 4.5-1.25S10.83 18.23 12 19m0-13C13.17 5.48 14.75 5 16.5 5s3.33.48 4.5 1.25V19c-1.17-.77-2.75-1.25-4.5-1.25S13.17 18.23 12 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </IconCircle>

          <Title>ETSU Admin Portal</Title>
          <Subtitle>Project &amp; Thesis Repository Management</Subtitle>
        </Header>

        <Body>
          <form onSubmit={onSubmit}>
            <Field>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="admin@etsu.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>

            <Field>
              <Label>Password</Label>
              <PasswordWrapper>
                <PasswordInput
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <ToggleButton
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </ToggleButton>
              </PasswordWrapper>
            </Field>

            {err ? <ErrorText>{err}</ErrorText> : null}

            <PrimaryButton disabled={busy} type="submit">
              {busy ? "Signing in..." : "Sign In"}
            </PrimaryButton>
          </form>

          {/* <DividerWrap>
            <Line />
            <DividerText>Or continue with</DividerText>
            <Line />
          </DividerWrap>

          <OutlineButton
            type="button"
            onClick={() => alert("Hook Microsoft OAuth here")}
            disabled={busy}
          >
            <MicrosoftIcon viewBox="0 0 23 23">
              <path d="M11 11H0V0h11v11z" fill="#F25022" />
              <path d="M23 11H12V0h11v11z" fill="#7FBA00" />
              <path d="M11 23H0V12h11v11z" fill="#00A4EF" />
              <path d="M23 23H12V12h11v11z" fill="#FFB900" />
            </MicrosoftIcon>
            Sign in with Microsoft
          </OutlineButton> */}

          <Footnote>
            Authorized personnel only. All access is monitored.
          </Footnote>
        </Body>
      </Card>
    </Bg>
  );
}

/** ETSU-ish palette */
const ETSU_NAVY = "#041E42";
const ETSU_GOLD = "#FFC72C";
const ETSU_LIGHT_BLUE = "#2D77C7";

const Bg = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 16px;
  overflow: hidden;

  background: linear-gradient(
    135deg,
    ${ETSU_NAVY},
    ${ETSU_NAVY},
    ${ETSU_LIGHT_BLUE}
  );
`;

// const Card = styled.div`
//   width: 100%;
//   max-width: 430px;
//   background: #ffffff;
//   border-radius: 18px;
//   box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
//   overflow: hidden;
// `;

const Card = styled.div`
  width: 100%;
  max-width: 430px;
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.22);
  overflow: hidden;
`;

const Header = styled.div`
  padding: 24px 22px 10px;
  text-align: center;
`;

const IconCircle = styled.div`
  width: 84px;
  height: 84px;
  margin: 4px auto 12px;
  border-radius: 999px;
  display: grid;
  place-items: center;

  background: ${ETSU_NAVY};
  color: ${ETSU_GOLD};
`;

const Title = styled.h2`
  margin: 0;
  color: ${ETSU_NAVY};
  font-size: 20px;
  font-weight: 800;
`;

const Subtitle = styled.p`
  margin: 8px 0 0;
  color: #4b5563;
  font-size: 13px;
`;

// const Body = styled.div`
//   padding: 18px 22px 22px;
// `;

const Body = styled.div`
  padding: 22px 24px 26px;
`;

// const Field = styled.div`
//   display: grid;
//   gap: 6px;
//   margin-bottom: 12px;
// `;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
  width: 100%;
`;

const Label = styled.label`
  font-size: 13px;
  color: #111827;
  font-weight: 700;
`;

// const Input = styled.input`
//   border: 1px solid #d1d5db;
//   border-radius: 12px;
//   padding: 10px 12px;
//   outline: none;
//   font-size: 14px;

//   &:focus {
//     border-color: ${ETSU_NAVY};
//     box-shadow: 0 0 0 3px rgba(4, 30, 66, 0.15);
//   }
// `;

// const Input = styled.input`
//   width: 100%;
//   border-sizing: border-box;
//   border: 1px solid #d1d5db;
//   border-radius: 12px;
//   padding: 10px 40px 10px 12px;
//   outline: none;
//   font-size: 14px;

//   &:focus {
//     border-color: ${ETSU_NAVY};
//     box-shadow: 0 0 0 3px rgba(4, 30, 66, 0.15);
//   }
// `;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #cbd5e1;
  border-radius: 14px;
  padding: 12px 14px;
  outline: none;
  font-size: 15px;
  background: #eef3fb;
  color: #111827;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${ETSU_NAVY};
    box-shadow: 0 0 0 3px rgba(4, 30, 66, 0.12);
    background: #fff;
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

// const PrimaryButton = styled.button`
//   width: 100%;
//   border: none;
//   border-radius: 12px;
//   padding: 11px 12px;
//   font-weight: 700;
//   color: white;
//   background: ${ETSU_NAVY};
//   cursor: pointer;
//   margin-top: 6px;

//   &:hover {
//     filter: brightness(0.95);
//   }
//   &:disabled {
//     opacity: 0.65;
//     cursor: not-allowed;
//   }
// `;

const PrimaryButton = styled.button`
  width: 100%;
  border: none;
  border-radius: 14px;
  padding: 13px 16px;
  font-weight: 700;
  font-size: 15px;
  color: white;
  background: ${ETSU_NAVY};
  cursor: pointer;
  margin-top: 4px;
  transition: 0.2s ease;

  &:hover {
    filter: brightness(0.96);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
    transform: none;
  }
`;

const DividerWrap = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 10px;
  margin: 16px 0 12px;
`;

const Line = styled.div`
  height: 1px;
  background: #d1d5db;
`;

const DividerText = styled.div`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #6b7280;
`;

const OutlineButton = styled.button`
  width: 100%;
  border-radius: 12px;
  padding: 10px 12px;
  font-weight: 700;
  cursor: pointer;

  background: white;
  border: 1px solid ${ETSU_NAVY};
  color: ${ETSU_NAVY};

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  &:hover {
    background: ${ETSU_NAVY};
    color: white;
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

const MicrosoftIcon = styled.svg`
  width: 18px;
  height: 18px;
`;

const Footnote = styled.p`
  margin: 14px 0 0;
  text-align: center;
  font-size: 11px;
  color: #6b7280;
`;

const ErrorText = styled.div`
  margin: 6px 0 0;
  color: #b91c1c;
  font-size: 13px;
`;

const BackLink = styled(Link)`
  position: absolute;
  top: 22px;
  left: 28px;

  color: white;
  font-size: 14px;
  text-decoration: none;
  font-weight: 500;

  opacity: 0.9;
  transition: 0.2s ease;

  &:hover {
    opacity: 1;
    text-decoration: underline;
  }
`;

const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const PasswordInput = styled(Input)`
  padding-right: 44px;
`;

const ToggleButton = styled.button`
  position: absolute;
  top: 50%;
  right: 14px;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  cursor: pointer;

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover {
    color: ${ETSU_NAVY};
  }
`;
