// ChartTooltip.jsx
import React from "react";

const ChartTooltip = ({ data, position, visible }) => {
  if (!visible || !data) return null;

  const tooltipStyle = {
    position: "absolute",
    left: `${position.x}px`,
    top: `${position.y}px`,
    backgroundColor: "white",
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    pointerEvents: "none",
    zIndex: 1000,
    transform: "translate(-100%, -100%)", // Center horizontally and place above the cursor
    marginTop: "50px", // Add a small gap above the cursor
  };

  return (
    <div style={tooltipStyle}>
      <div>{`${data.key}: ${data.lag}`}</div>
      <div>{`Time: ${data.time}`}</div>
    </div>
  );
};

export default ChartTooltip;
