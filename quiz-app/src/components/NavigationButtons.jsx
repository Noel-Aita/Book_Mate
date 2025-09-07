// src/components/NavigationButtons.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const NavigationButtons = ({ backTo, nextTo, nextDisabled = false }) => {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
      {backTo && (
        <button onClick={() => navigate(backTo)} style={{ padding: "10px 20px" }}>
          Back
        </button>
      )}
      {nextTo && (
        <button
          onClick={() => navigate(nextTo)}
          style={{ padding: "10px 20px" }}
          disabled={nextDisabled}
        >
          Next
        </button>
      )}
    </div>
  );
};

export default NavigationButtons;
