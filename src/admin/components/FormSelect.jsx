import React from "react";
import ReactSelect from "react-select";
import { ETSU_NAVY } from "../dashboardStyles";

// We define the consistent styling here so all dropdowns look the same
const customStyles = {
  control: (provided) => ({
    ...provided,
    borderRadius: "12px",
    borderColor: "#e2e8f0",
    padding: "2px",
    boxShadow: "none",
    fontSize: "14px",
    "&:hover": { borderColor: "#cbd5e1" },
  }),
  option: (provided, state) => ({
    ...provided,
    color: ETSU_NAVY,
    backgroundColor: state.isSelected
      ? "#eef2f7"
      : state.isFocused
        ? "#f8fafc"
        : "white",
    cursor: "pointer",
    fontSize: "14px",
  }),
};

export default function FormSelect({ options, value, onChange, placeholder }) {
  // Find the label matching the current value to show in the box
  const selectedOption = options.find((opt) => opt.value === value) || null;

  return (
    <ReactSelect
      options={options}
      styles={customStyles}
      value={selectedOption}
      onChange={(selected) => onChange(selected ? selected.value : "")}
      placeholder={placeholder}
      isClearable
    />
  );
}
