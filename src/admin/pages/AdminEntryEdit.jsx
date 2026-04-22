import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaBookOpen, FaFolderOpen } from "react-icons/fa";
import { useAdminAuth } from "../AdminAuthContext";
import { ETSU_NAVY, BORDER, MUTED } from "../dashboardStyles";
import EditProjectForm from "./EditProjectForm";
import EditThesisForm from "./EditThesisForm";
import LoadingScreen from "../components/LoadingScreen";

const API_BASE = "https://csciprojecthub.etsu.edu/api";

export default function AdminEntryEdit() {
  const { kind, id } = useParams();
  const navigate = useNavigate();
  const { adminUser } = useAdminAuth();

  const isProject = kind === "project";
  const isThesis = kind === "thesis";

  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const ac = new AbortController();

    async function loadEntry() {
      try {
        setLoading(true);
        setLoadError("");
        const storedSession = sessionStorage.getItem("capstone_admin_session");
        const session = storedSession ? JSON.parse(storedSession) : null;
        const token = session?.access_token;

        if (!token) {
          throw new Error("No access token found in session storage");
        }

        const endpoint = isProject
          ? `${API_BASE}/projects/${id}`
          : isThesis
            ? `${API_BASE}/research/${id}`
            : null;

        if (!endpoint) {
          throw new Error("Invalid entry type.");
        }

        const res = await fetch(endpoint, {
          signal: ac.signal,
          headers: {
            Authorization: `Bearer ${token.trim()}`,
            Accept: "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to load entry (${res.status})`);
        }

        const data = await res.json();
        setEntry(data);
      } catch (err) {
        console.log(err);

        if (err.name !== "AbortError") {
          setLoadError(err.message || "Failed to load entry.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadEntry();
    return () => ac.abort();
  }, [id, isProject, isThesis, adminUser]);

  async function handleSave(payload) {
    console.log(payload);

    try {
      setSaving(true);
      setSaveError("");

      const endpoint = isProject
        ? `${API_BASE}/projects/${id}`
        : `${API_BASE}/research/${id}`;

      const res = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(adminUser?.access_token
            ? { Authorization: `Bearer ${adminUser.access_token}` }
            : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        const msg = errData?.detail
          ? Array.isArray(errData.detail)
            ? errData.detail.map((d) => d.msg).join(", ")
            : String(errData.detail)
          : `Update failed (${res.status})`;
        throw new Error(msg);
      }
      return true;
      // navigate(`/admin/entries/${kind}/${id}`);
    } catch (err) {
      setSaveError(err.message || "Failed to update entry.");
    } finally {
      setSaving(false);
    }
  }

  // 1. First, check if we are still fetching
  if (loading) {
    return (
      <Page>
        <StateCard>Loading editor...</StateCard>
      </Page>
    );
  }
  if (loading || (!entry && !loadError)) {
    return (
      <LoadingScreen
        title="Loading Editor"
        subtitle="Fetching the latest details from the repository..."
        compact
      />
    );
  }
  // 2. Second, check if there was an actual error during fetch
  if (loadError) {
    return (
      <Page>
        <StateCard>
          <ErrorText>{loadError}</ErrorText>
          <BackButton type="button" onClick={() => navigate("/admin/projects")}>
            Back to Projects
          </BackButton>
        </StateCard>
      </Page>
    );
  }

  // 3. Finally, check if the entry is missing after loading finished without error
  // if (!entry) {
  //   return (
  //     <Page>
  //       <StateCard>
  //         <ErrorText>Entry not found.</ErrorText>
  //         <BackButton type="button" onClick={() => navigate(-1)}>
  //           Back
  //         </BackButton>
  //       </StateCard>
  //     </Page>
  //   );
  // }

  return (
    <Page>
      <ScrollArea>
        <Card>
          <Header>
            <HeaderLeft>
              <HeaderIcon>
                {isProject ? <FaFolderOpen /> : <FaBookOpen />}
              </HeaderIcon>
              <div>
                <Title>{isProject ? "Edit Project" : "Edit Thesis"}</Title>
                <Subtitle>
                  Update the existing {isProject ? "project" : "thesis"}{" "}
                  details.
                </Subtitle>
              </div>
            </HeaderLeft>

            <BackButton type="button" onClick={() => navigate(-1)}>
              <FaArrowLeft />
              <span>Back</span>
            </BackButton>
          </Header>

          {isProject ? (
            <EditProjectForm
              initialData={entry}
              saving={saving}
              onCancel={() => navigate(`/admin/entries/${kind}/${id}`)}
              onSubmit={handleSave}
            />
          ) : (
            <EditThesisForm
              initialData={entry}
              saving={saving}
              onCancel={() => navigate(`/admin/entries/${kind}/${id}`)}
              onSubmit={handleSave}
            />
          )}
          {saveError ? <ErrorBanner>{saveError}</ErrorBanner> : null}
        </Card>
      </ScrollArea>
    </Page>
  );
}

const Page = styled.div`
  height: calc(100vh - 84px);
  overflow: hidden;
  background: #f8fafc;
`;

const ScrollArea = styled.div`
  height: 100%;
  overflow-y: auto;
  padding: 22px 24px 120px;
  box-sizing: border-box;
`;

const Card = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  background: white;
  border: 1px solid ${BORDER};
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 10px 28px rgba(4, 30, 66, 0.05);
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const HeaderLeft = styled.div`
  display: flex;
  gap: 14px;
  align-items: flex-start;
`;

const HeaderIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: rgba(4, 30, 66, 0.08);
  color: ${ETSU_NAVY};
  display: grid;
  place-items: center;
  font-size: 18px;
`;

const Title = styled.h1`
  margin: 0;
  color: ${ETSU_NAVY};
  font-size: 28px;
  line-height: 1.1;
`;

const Subtitle = styled.p`
  margin: 6px 0 0;
  color: ${MUTED};
`;

const BackButton = styled.button`
  border: 1px solid ${BORDER};
  background: white;
  color: ${ETSU_NAVY};
  border-radius: 12px;
  padding: 10px 14px;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

const ErrorBanner = styled.div`
  margin-top: 16px;
  border: 1px solid #fecaca;
  background: #fef2f2;
  color: #b91c1c;
  border-radius: 12px;
  padding: 12px 14px;
`;

const ErrorText = styled.div`
  color: #b91c1c;
  font-weight: 700;
  margin-bottom: 12px;
`;

const StateCard = styled.div`
  margin: 24px;
  background: white;
  border: 1px solid ${BORDER};
  border-radius: 18px;
  padding: 24px;
`;
