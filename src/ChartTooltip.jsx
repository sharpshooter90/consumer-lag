// ChartTooltip.jsx
import React from "react";
import { FolderIcon, LayersIcon, ClockIcon } from "lucide-react";

const ChartTooltip = ({ data, position, visible }) => {
  if (!visible || !data) return null;

  const tooltipStyle = {
    position: "absolute",
    left: `${position.x}px`,
    top: `${position.y}px`,
    backgroundColor: "white",
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "12px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    pointerEvents: "none",
    zIndex: 1000,
    transform: "translate(-100%, -100%)",
    marginTop: "-10px",
    width: "280px", // Adjust as needed
  };

  const [group, topic, partition] = data.key.split("-");

  return (
    <div style={tooltipStyle} className="card-tooltip">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FolderIcon className="w-4 h-4" />
            <span>{group}</span>
          </div>
          <h3 className="text-sm font-semibold">{topic}</h3>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <LayersIcon className="w-4 h-4" />
            <span>Partition {partition}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ClockIcon className="w-4 h-4" />
            <span>{data.time}</span>
          </div>
        </div>
        <div className="text-sm font-medium">Lag: {data.lag.toFixed(2)}</div>
      </div>
    </div>
  );
};

export default ChartTooltip;
