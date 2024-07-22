// ChartTooltip.jsx
import React from "react";
import { FolderIcon, LayersIcon, ClockIcon } from "lucide-react";

const ChartTooltip = ({ data, position, visible }) => {
  if (!visible || !data) return null;

  const tooltipStyle = {
    position: "absolute",
    left: `${position.x}px`,
    top: `${position.y}px`,
    pointerEvents: "none",
    zIndex: 1000,
    transform: "translate(-100%, -100%)",
    marginTop: "-10px",
    width: "280px", // Adjust as needed
  };

  const [group, topic, partition] = data.key.split("-");

  return (
    <div
      style={tooltipStyle}
      className="card-tooltip bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <FolderIcon className="w-4 h-4" />
            <span>{group}</span>
          </div>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            {topic}
          </h3>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <LayersIcon className="w-4 h-4" />
            <span>Partition {partition}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <ClockIcon className="w-4 h-4" />
            <span>{data.time}</span>
          </div>
        </div>
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Lag: {data.lag.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default ChartTooltip;
