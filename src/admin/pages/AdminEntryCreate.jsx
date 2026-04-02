import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaBookOpen, FaFolderOpen } from "react-icons/fa";
import { useAdminAuth } from "../AdminAuthContext";
import { ETSU_NAVY, BORDER, MUTED } from "../dashboardStyles";
import CreateProjectForm from "./CreateProjectForm";
import CreateThesisForm from "./CreateThesisForm";

const API_BASE = "https://crpp-project.onrender.com";

export default function AdminEntryCreate() {
  const { kind } = useParams();
  const navigate = useNavigate();
  const { adminUser } = useAdminAuth();

  const isProject = kind === "project";
  const isThesis = kind === "thesis";

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  async function handleCreate(payload) {
    try {
      setSaving(true);
      setSaveError("");

      const endpoint = isProject
        ? `${API_BASE}/projects/`
        : `${API_BASE}/research/`;

      const res = await fetch(endpoint, {
        method: "POST",
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
        const msg =
          errData?.detail
            ? Array.isArray(errData.detail)
              ? errData.detail.map((d) => d.msg).join(", ")
              : String(errData.detail)
            : `Create failed (${res.status})`;
        throw new Error(msg);
      }

      navigate("/admin/projects");
    } catch (err) {
      setSaveError(err.message || "Failed to create entry.");
    } finally {
      setSaving(false);
    }
  }

  if (!isProject && !isThesis) {
    return (
      <Page>
        <ScrollArea>
          <Card>
            <ErrorBanner>Invalid entry type.</ErrorBanner>
            <BackButton type="button" onClick={() => navigate("/admin/projects")}>
              <FaArrowLeft />
              <span>Back</span>
            </BackButton>
          </Card>
        </ScrollArea>
      </Page>
    );
  }

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
                <Title>{isProject ? "Add New Project" : "Add New Thesis"}</Title>
                <Subtitle>
                  Fill in the details below to create a new{" "}
                  {isProject ? "project" : "thesis"}.
                </Subtitle>
              </div>
            </HeaderLeft>

            <BackButton
              type="button"
              onClick={() => navigate("/admin/projects")}
            >
              <FaArrowLeft />
              <span>Back</span>
            </BackButton>
          </Header>

          {saveError ? <ErrorBanner>{saveError}</ErrorBanner> : null}

          {isProject ? (
            <CreateProjectForm
              saving={saving}
              onCancel={() => navigate("/admin/projects")}
              onSubmit={handleCreate}
            />
          ) : (
            <CreateThesisForm
              saving={saving}
              onCancel={() => navigate("/admin/projects")}
              onSubmit={handleCreate}
            />
          )}
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
  padding: 22px 24px 36px;
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
  flex-shrink: 0;
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
  line-height: 1.5;
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

  &:hover {
    background: #f8fafc;
  }
`;

const ErrorBanner = styled.div`
  margin-top: 16px;
  margin-bottom: 8px;
  border: 1px solid #fecaca;
  background: #fef2f2;
  color: #b91c1c;
  border-radius: 12px;
  padding: 12px 14px;
`;