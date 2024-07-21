import React, { useState, useEffect, useCallback, useRef } from "react";
import { Fullscreen, Share, Info, MoreVertical } from "lucide-react";
import FullScreenWrapper from "./FullScreenWrapper";
import ThresholdLine from "./ThresholdLine";
import KafkaDataTable from "./KafkaDataTable";
import SystemMetricsDashboard from "./SystemMetricsDashboard";
import {
  generateMockData,
  findNearestDataPoint,
  isConnectionActive,
} from "./utils";
import {
  consumerGroups,
  topics,
  partitions,
  groupColors,
  groupTopicRelations,
  timeSeriesOptions,
  PADDING,
} from "./constants";

const KafkaDiagramAndChart = () => {
  const [activeTab, setActiveTab] = useState("table");
  const [showDiagram, setShowDiagram] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [containerWidth, setContainerWidth] = useState(800); // Default width
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedPartitions, setSelectedPartitions] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [hoveredLine, setHoveredLine] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [threshold, setThreshold] = useState(500);
  const [timeSeriesOption, setTimeSeriesOption] = useState("6h");
  const [tooltipData, setTooltipData] = useState(null);

  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const chartWidth = 800; // You can adjust this value
  const chartHeight = 400; // You can adjust this value
  const xScale = (index) =>
    PADDING.left +
    (index / (chartData.length - 1)) *
      (containerWidth - PADDING.left - PADDING.right);
  const yScale = (value) =>
    chartHeight -
    PADDING.bottom -
    (value / 3) * (chartHeight - PADDING.top - PADDING.bottom);

  const toggleSelection = (item, currentSelection, setSelection) => {
    if (currentSelection.includes(item)) {
      setSelection(currentSelection.filter((i) => i !== item));
    } else {
      setSelection([...currentSelection, item]);
    }
  };
  const handleFullScreenClick = () => {
    setIsFullScreen(true);
  };
  const handleThresholdChange = (newThreshold) => {
    setThreshold(newThreshold);
    // You can add logic here to trigger alerts when data points cross the threshold
  };
  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setModalData(null);
  }, []);
  const applyFilters = () => {
    const newData = generateMockData(
      timeSeriesOption,
      selectedGroups,
      selectedTopics,
      selectedPartitions,
      consumerGroups,
      topics,
      partitions,
      groupTopicRelations,
    );
    setChartData(newData);
  };
  const handleLineHover = useCallback(
    (key, time, lag, clientX, clientY) => {
      if (svgRef.current && time !== undefined && lag !== undefined) {
        const svgRect = svgRef.current.getBoundingClientRect();
        const x = (clientX - svgRect.left) * (chartWidth / svgRect.width);
        const y = (clientY - svgRect.top) * (chartHeight / svgRect.height);
        setHoveredLine(key);
        setTooltipData({ key, time, lag, x, y });
      }
    },
    [chartWidth, chartHeight],
  );
  const handleLineLeave = useCallback(() => {
    setHoveredLine(null);
    setTooltipData(null);
  }, []);

  const handleLineClick = useCallback(
    (key) => {
      const [group, topic, partition] = key.split("-");
      const clickedData = chartData.map((point) => ({
        time: point.time,
        lag: point[key],
      }));
      setModalData({
        group,
        topic,
        partition,
        data: clickedData,
        timeSeriesOption,
      });
      setIsModalOpen(true);
    },
    [chartData, timeSeriesOption],
  );

  useEffect(() => {
    applyFilters();
  }, [timeSeriesOption]);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateDimensions(); // Initial measurement
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // jsx blocks
  const renderFilters = () => (
    <div className="mb-4">
      <div className="flex gap-6">
        <div>
          <h3 className="font-bold">Consumer Groups</h3>
          {consumerGroups.map((group) => (
            <label key={group} className="block">
              <input
                type="checkbox"
                checked={selectedGroups.includes(group)}
                onChange={() =>
                  toggleSelection(group, selectedGroups, setSelectedGroups)
                }
              />{" "}
              {group}
            </label>
          ))}
        </div>
        <div>
          <h3 className="font-bold">Topics</h3>
          {topics.map((topic) => (
            <label key={topic} className="block">
              <input
                type="checkbox"
                checked={selectedTopics.includes(topic)}
                onChange={() =>
                  toggleSelection(topic, selectedTopics, setSelectedTopics)
                }
              />{" "}
              {topic}
            </label>
          ))}
        </div>
        <div>
          <h3 className="font-bold">Partitions</h3>
          {partitions.map((partition) => (
            <label key={partition} className="block">
              <input
                type="checkbox"
                checked={selectedPartitions.includes(partition)}
                onChange={() =>
                  toggleSelection(
                    partition,
                    selectedPartitions,
                    setSelectedPartitions,
                  )
                }
              />{" "}
              {partition}
            </label>
          ))}
        </div>
      </div>
      <button
        onClick={applyFilters}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Apply Filters
      </button>
    </div>
  );
  const renderDiagram = () => (
    <div>
      <div className="flex items-center mb-4">
        <span className="mr-2">
          Show Consumer Groups Diagram (relationship)
        </span>
        <label className="switch">
          <input
            type="checkbox"
            checked={showDiagram}
            onChange={() => setShowDiagram(!showDiagram)}
          />
          <span className="slider round"></span>
        </label>
      </div>
      {showDiagram && (
        <svg width="800" height="500" viewBox="0 0 800 500">
          {/* Consumer Groups */}
          <g>
            {consumerGroups.map((group, index) => (
              <g key={group}>
                <rect
                  x="10"
                  y={50 + index * 100}
                  width="150"
                  height="60"
                  fill={groupColors[group]}
                  stroke="black"
                  strokeWidth="2"
                  opacity={
                    selectedGroups.length === 0 ||
                    selectedGroups.includes(group)
                      ? 1
                      : 0.4
                  }
                />
                <text
                  x="85"
                  y={85 + index * 100}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="black"
                  fontWeight="bold"
                >
                  {group}
                </text>
                {groupTopicRelations[group].map((topic, topicIndex) => (
                  <path
                    key={`${group}-${topic}`}
                    d={`M 160 ${80 + index * 100} Q 280 ${
                      80 + index * 100
                    }, 300 ${65 + topics.indexOf(topic) * 100}`}
                    fill="none"
                    stroke={groupColors[group]}
                    strokeWidth="2"
                    opacity={
                      isConnectionActive(
                        group,
                        topic,
                        null,
                        selectedGroups,
                        selectedTopics,
                        selectedPartitions,
                        groupTopicRelations,
                      )
                        ? 1
                        : 0.4
                    }
                  />
                ))}
              </g>
            ))}
          </g>

          {/* Topics */}
          <g>
            {topics.map((topic, index) => (
              <g key={topic}>
                <rect
                  x="300"
                  y={50 + index * 100}
                  width="150"
                  height="60"
                  fill="#fff0e6"
                  stroke="#ff9933"
                  strokeWidth="2"
                  opacity={
                    selectedTopics.length === 0 ||
                    selectedTopics.includes(topic)
                      ? 1
                      : 0.4
                  }
                />
                <text
                  x="375"
                  y={85 + index * 100}
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {topic}
                </text>
                {consumerGroups.map(
                  (group) =>
                    groupTopicRelations[group].includes(topic) &&
                    partitions.map((partition) => (
                      <path
                        key={`${topic}-${group}-${partition}`}
                        d={`M 450 ${80 + index * 100} Q 570 ${
                          80 + index * 100
                        }, 590 ${65 + partitions.indexOf(partition) * 80}`}
                        fill="none"
                        stroke={groupColors[group]}
                        strokeWidth="2"
                        opacity={
                          isConnectionActive(
                            group,
                            topic,
                            partition,
                            selectedGroups,
                            selectedTopics,
                            selectedPartitions,
                            groupTopicRelations,
                          )
                            ? 1
                            : 0.4
                        }
                      />
                    )),
                )}
              </g>
            ))}
          </g>

          {/* Partitions */}
          <g>
            {partitions.map((partition, index) => (
              <g key={partition}>
                <rect
                  x="590"
                  y={50 + index * 80}
                  width="150"
                  height="50"
                  fill="#e6ffe6"
                  stroke="#33cc33"
                  strokeWidth="2"
                  opacity={
                    selectedPartitions.length === 0 ||
                    selectedPartitions.includes(partition)
                      ? 1
                      : 0.4
                  }
                />
                <text
                  x="665"
                  y={75 + index * 80}
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {partition}
                </text>
              </g>
            ))}
          </g>

          {/* Labels */}
          <text x="85" y="30" textAnchor="middle" fontWeight="bold">
            Consumer Groups
          </text>
          <text x="375" y="30" textAnchor="middle" fontWeight="bold">
            Topics
          </text>
          <text x="665" y="30" textAnchor="middle" fontWeight="bold">
            Partitions
          </text>
        </svg>
      )}
    </div>
  );
  const renderChart = () => (
    <FullScreenWrapper>
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Consumer Lag Chart</h3>
        <div className="mb-4">
          <label htmlFor="timeSeriesSelect" className="mr-2">
            Time Range:
          </label>
          <select
            id="timeSeriesSelect"
            value={timeSeriesOption}
            onChange={(e) => setTimeSeriesOption(e.target.value)}
            className="border rounded p-1"
          >
            {timeSeriesOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end mb-2 space-x-2">
          <button
            aria-label="full screen"
            className="p-2 hover:bg-gray-200 rounded"
            onClick={handleFullScreenClick}
          >
            <Fullscreen className="w-5 h-5" />
          </button>
          <button aria-label="share" className="p-2 hover:bg-gray-200 rounded">
            <Share className="w-5 h-5" />
          </button>
          <button aria-label="info" className="p-2 hover:bg-gray-200 rounded">
            <Info className="w-5 h-5" />
          </button>
          <button aria-label="more" className="p-2 hover:bg-gray-200 rounded">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
        <div ref={containerRef} className="w-full h-[400px]">
          <svg
            ref={svgRef}
            width="100%"
            height="100%"
            viewBox={`0 0 ${containerWidth} ${chartHeight}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <g>
              {/* X and Y axes */}
              <line
                x1={PADDING.left}
                y1={chartHeight - PADDING.bottom}
                x2={containerWidth - PADDING.right}
                y2={chartHeight - PADDING.bottom}
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1={PADDING.left}
                y1={chartHeight - PADDING.bottom}
                x2={PADDING.left}
                y2={PADDING.top}
                stroke="black"
                strokeWidth="2"
              />

              {/* Horizontal gridlines */}
              {[0, 250, 500, 750, 1000].map((value, index) => (
                <line
                  key={index}
                  x1={PADDING.left}
                  y1={yScale(value)}
                  x2={containerWidth - PADDING.right}
                  y2={yScale(value)}
                  stroke="lightgray"
                  strokeDasharray="4"
                />
              ))}

              {/* Chart lines */}
              {chartData.length > 0 &&
                Object.keys(chartData[0])
                  .filter((key) => key !== "time")
                  .map((key) => (
                    <path
                      key={key}
                      d={chartData
                        .map(
                          (point, i) =>
                            `${i === 0 ? "M" : "L"} ${xScale(i)} ${yScale(
                              point[key],
                            )}`,
                        )
                        .join(" ")}
                      fill="none"
                      stroke={groupColors[key.split("-")[0]]}
                      strokeWidth="2"
                      opacity={
                        hoveredLine ? (hoveredLine === key ? 1 : 0.1) : 1
                      }
                      cursor="pointer"
                      onClick={() => handleLineClick(key)}
                      onMouseEnter={(e) => {
                        if (svgRef.current) {
                          const point = findNearestDataPoint(
                            e.clientX,
                            chartData,
                            svgRef.current,
                          );
                          if (point) {
                            handleLineHover(
                              key,
                              point.time,
                              point[key],
                              e.clientX,
                              e.clientY,
                            );
                          }
                        }
                      }}
                      onMouseLeave={handleLineLeave}
                      style={{ transition: "opacity 0.2s ease-in-out" }}
                    />
                  ))}

              {/* X-axis labels */}
              {chartData.map((point, index) => (
                <text
                  key={index}
                  x={xScale(index)}
                  y={chartHeight - PADDING.bottom + 20}
                  textAnchor="middle"
                  fontSize="10"
                  transform={`rotate(-45 ${xScale(index)},${
                    chartHeight - PADDING.bottom + 20
                  })`}
                >
                  {point.time}
                </text>
              ))}

              {[0, 0.75, 1.5, 2.25, 3].map((value) => (
                <text
                  key={value}
                  x={PADDING.left - 10}
                  y={yScale(value)}
                  textAnchor="end"
                  alignmentBaseline="middle"
                  fontSize="10"
                >
                  {value}
                </text>
              ))}
              {/* Y-axis label */}
              <text
                x={-chartHeight / 2}
                y={PADDING.left / 3}
                transform={`rotate(-90)`}
                textAnchor="middle"
                fontSize="12"
                fontWeight="bold"
              >
                Delay in Seconds
              </text>

              {/* Threshold Line */}
              <ThresholdLine
                containerWidth={containerWidth}
                chartHeight={chartHeight}
                maxValue={1000}
                onThresholdChange={handleThresholdChange}
                xScale={xScale}
                yScale={yScale}
                padding={PADDING}
              />

              {/* Tooltip */}
              {tooltipData && (
                <foreignObject
                  x={tooltipData.x}
                  y={tooltipData.y - 40}
                  width="150"
                  height="60"
                >
                  <div
                    xmlns="http://www.w3.org/1999/xhtml"
                    className="bg-white border p-2 rounded shadow-md"
                  >
                    <div>
                      {tooltipData.key}: {tooltipData.lag}
                    </div>
                    <div
                      className="text-blue-500 underline cursor-pointer"
                      onClick={() => handleLineClick(tooltipData.key)}
                    >
                      View Details
                    </div>
                  </div>
                </foreignObject>
              )}
            </g>
          </svg>
        </div>
      </div>
    </FullScreenWrapper>
  );
  const renderTabs = () => (
    <div className="mt-8">
      <div className="flex border-b mb-4">
        <button
          className={`py-2 px-4 font-semibold ${
            activeTab === "table"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("table")}
        >
          Consumer Lag Data
        </button>
        <button
          className={`py-2 px-4 font-semibold ${
            activeTab === "placeholder"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("placeholder")}
        >
          [Selected Chart Item details]
        </button>
      </div>
      {/* Tab Content */}
      {activeTab === "table" ? (
        <KafkaDataTable chartData={chartData} />
      ) : (
        <SystemMetricsDashboard />
      )}
    </div>
  );
  const renderModal = () => (
    <div>
      {isModalOpen && modalData && (
        <div className="fixed bottom-0 left-0 w-full h-96 bg-white border-t shadow-lg">
          <h2 className="text-xl font-bold p-4">Chart Details</h2>
          <div className="px-4 py-2 bg-gray-100 mb-4 flex gap-4">
            <p>
              <strong>Group:</strong> {modalData.group}
            </p>
            <p>
              <strong>Topic:</strong> {modalData.topic}
            </p>
            <p>
              <strong>Partition:</strong> {modalData.partition}
            </p>
            <p>
              <strong>Time Range:</strong>{" "}
              {
                timeSeriesOptions.find(
                  (opt) => opt.value === modalData.timeSeriesOption,
                ).label
              }
            </p>
          </div>
          <button
            onClick={handleModalClose}
            className="absolute top-4 right-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            Close
          </button>
          <div className="overflow-scroll h-full">
            <SystemMetricsDashboard />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-4 bg-white">
      <h2 className="text-2xl font-bold mb-4">
        Message Queue Monitoring / Kafka
      </h2>
      {/* Filters */}
      {renderFilters()}

      {/* Relationship Diagram */}
      {renderDiagram()}

      {/* Interactive Consumer Lag Chart */}
      {renderChart()}

      {/* Horizontal Tab */}
      {renderTabs()}

      {/* Modal */}
      {renderModal()}

      {/* Render Legends */}
      {/* <div className="mt-4 flex flex-wrap">
        {chartData.length > 0 &&
          Object.keys(chartData[0])
            .filter((key) => key !== "time")
            .map((key, index) => (
              <div
                key={key}
                className="mr-4 mb-2 flex items-center cursor-pointer"
                onMouseEnter={() => handleLineHover(key)}
                onMouseLeave={handleLineLeave}
              >
                <div
                  className="w-4 h-4 mr-2"
                  style={{
                    backgroundColor: groupColors[key.split("-")[0]],
                    opacity:
                      hoveredLine === null || hoveredLine === key ? 1 : 0.2,
                  }}
                ></div>
                <span
                  style={{
                    opacity:
                      hoveredLine === null || hoveredLine === key ? 1 : 0.2,
                  }}
                >
                  {key}
                </span>
              </div>
            ))}
      </div>
          */}
    </div>
  );
};

export default KafkaDiagramAndChart;
