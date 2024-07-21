import React, { useState } from "react";

const ThresholdLine = ({
  containerWidth,
  chartHeight,
  maxValue,
  onThresholdChange,
  xScale,
  yScale,
  padding,
}) => {
  const [threshold, setThreshold] = useState(500);

  const handleDrag = (e) => {
    const svg = e.target.ownerSVGElement;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
    const newThreshold = Math.max(
      0,
      Math.min(maxValue, maxValue - (svgP.y / chartHeight) * maxValue),
    );
    setThreshold(Math.round(newThreshold));
    onThresholdChange(Math.round(newThreshold));
  };

  return (
    <>
      <line
        x1={padding.left}
        y1={yScale(threshold)}
        x2={containerWidth - padding.right}
        y2={yScale(threshold)}
        stroke="red"
        strokeWidth="2"
        strokeDasharray="5,5"
        style={{ cursor: "ns-resize" }}
        onMouseDown={(e) => {
          e.preventDefault();
          document.addEventListener("mousemove", handleDrag);
          document.addEventListener(
            "mouseup",
            () => {
              document.removeEventListener("mousemove", handleDrag);
            },
            { once: true },
          );
        }}
      />
      <text
        x={containerWidth - padding.right - 5}
        y={yScale(threshold) - 5}
        fill="red"
        textAnchor="end"
        fontSize="12"
      >
        Threshold: {threshold}
      </text>
    </>
  );
};

export default ThresholdLine;
