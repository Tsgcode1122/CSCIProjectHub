import React, { useState, useEffect } from "react";
import ReactSelect from "react-select";

import { ETSU_NAVY } from "../dashboardStyles";
import CreateUserModal from "../../components/CreateUser";

const API_BASE = "https://csciprojecthub.etsu.edu/api";
const STORAGE_KEY = "capstone_admin_session";

export default function SupervisorSelect({ value, onChange }) {
  const [apiSupervisors, setApiSupervisors] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchSupervisors = async () => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      const token = stored ? JSON.parse(stored)?.access_token : null;
      if (!token) return;

      const res = await fetch(`${API_BASE}/supervisors/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        setApiSupervisors(
          data.sort((a, b) => a.fullname.localeCompare(b.fullname)),
        );
      }
    } catch (err) {
      console.error("Error fetching supervisors:", err);
    }
  };

  useEffect(() => {
    fetchSupervisors();
  }, []);

  const options = apiSupervisors.map((s) => ({
    value: s.fullname,
    label: s.fullname,
  }));
  options.push({
    value: "ADD_NEW",
    label: "➕ Not in list? Add New Supervisor",
    isCustomAction: true,
  });

  const customStyles = {
    control: (base) => ({
      ...base,
      borderRadius: "12px",
      padding: "2px",
      border: "1px solid #e2e8f0",
      zIndex: 10,
    }),
    // ✅ Add the menu style here
    menu: (provided) => ({
      ...provided,
      zIndex: 30, // This ensures the dropdown list floats over the table
    }),
    option: (base, state) => ({
      ...base,
      color: state.data.isCustomAction ? "#3B82F6" : ETSU_NAVY,
      fontWeight: state.data.isCustomAction ? "800" : "500",
      backgroundColor: state.isFocused ? "#f8fafc" : "white",
      borderTop: state.data.isCustomAction ? "1px solid #eee" : "none",
    }),
  };

  return (
    <>
      <ReactSelect
        options={options}
        styles={customStyles}
        value={options.find((opt) => opt.value === value) || null}
        placeholder="Select a supervisor..."
        isClearable
        onChange={(opt) => {
          if (opt?.value === "ADD_NEW") setShowAddModal(true);
          else onChange(opt ? opt.value : "");
        }}
      />

      {showAddModal && (
        <CreateUserModal
          isSupervisor={true}
          onClose={() => setShowAddModal(false)}
          onSuccess={(newSup) => {
            setShowAddModal(false);
            fetchSupervisors();
            if (newSup?.fullname) onChange(newSup.fullname);
          }}
        />
      )}
    </>
  );
}
