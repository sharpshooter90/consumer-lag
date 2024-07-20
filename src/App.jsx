import React, { useState, useEffect, useCallback, useMemo } from "react";

const KafkaDataTable = ({ chartData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const flattenedData = useMemo(() => {
    if (!chartData.length) return [];
    return chartData.flatMap((point) =>
      Object.entries(point)
        .filter(([key]) => key !== "time")
        .map(([key, value]) => {
          const [group, topic, partition] = key.split("-");
          return {
            time: point.time,
            group,
            topic,
            partition,
            lag: value,
            lagPercentage: ((value / 1000) * 100).toFixed(2) + "%",
            status: value > 750 ? "High" : value > 500 ? "Medium" : "Low",
          };
        })
    );
  }, [chartData]);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [filters, setFilters] = useState({ status: null });

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleSortClick = (column) => {
    setSortBy(column);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleFilterChange = (field, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
    }));
  };

  const filteredData = useMemo(() => {
    let data = flattenedData;

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      data = data.filter(
        (item) =>
          item.group.toLowerCase().includes(lowerQuery) ||
          item.topic.toLowerCase().includes(lowerQuery) ||
          item.partition.toLowerCase().includes(lowerQuery)
      );
    }

    if (filters.status) {
      data = data.filter((item) => item.status === filters.status);
    }

    if (sortBy) {
      data = data.sort((a, b) => {
        const valueA = sortBy === "lag" ? parseInt(a[sortBy], 10) : a[sortBy];
        const valueB = sortBy === "lag" ? parseInt(b[sortBy], 10) : b[sortBy];

        if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
        if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return data;
  }, [flattenedData, searchQuery, sortBy, sortOrder, filters]);

  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">Consumer Lag Data Table</h3>
      <div className="flex gap-4 items-center">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="mb-4 px-3 py-2 border rounded-md"
        />

        {/* Filters */}
        <div className="mb-4">
          <label htmlFor="statusFilter" className="mr-2">
            Status:
          </label>
          <select
            id="statusFilter"
            value={filters.status || ""}
            onChange={(e) => handleFilterChange("status", e.target.value)}
          >
            <option value="">All</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-between items-center mb-4">
        <div>
          Showing page {currentPage} of {pageCount}
        </div>
        <div>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-2 py-1 bg-blue-500 text-white rounded mr-2 disabled:bg-gray-300"
          >
            Previous
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, pageCount))
            }
            disabled={currentPage === pageCount}
            className="px-2 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <div style={{ height: "300px", overflowY: "auto" }}>
          <table className="min-w-full bg-white">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="sticky top-0 px-4 py-2">Time</th>
                <th className="sticky top-0 px-4 py-2">Group</th>
                <th className="sticky top-0 px-4 py-2">Topic</th>
                <th className="sticky top-0 px-4 py-2">Partition</th>
                <th
                  className="sticky top-0 px-4 py-2 cursor-pointer"
                  onClick={() => handleSortClick("lag")}
                >
                  Lag {sortBy === "lag" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th className="sticky top-0 px-4 py-2">Lag %</th>
                <th className="sticky top-0 px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                >
                  <td className="border px-4 py-2">{item.time}</td>
                  <td className="border px-4 py-2">{item.group}</td>
                  <td className="border px-4 py-2">{item.topic}</td>
                  <td className="border px-4 py-2">{item.partition}</td>
                  <td className="border px-4 py-2">{item.lag}</td>
                  <td className="border px-4 py-2">{item.lagPercentage}</td>
                  <td className="border px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded ${
                        item.status === "High"
                          ? "bg-red-500 text-white"
                          : item.status === "Medium"
                          ? "bg-yellow-500 text-black"
                          : "bg-green-500 text-white"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ThresholdLine = ({
  chartWidth,
  chartHeight,
  maxValue,
  onThresholdChange,
  xOffset = 50, // X-axis offset
  yOffset = 50, // Top padding
  bottomOffset = 350, // Y-axis end point
}) => {
  const [threshold, setThreshold] = useState(500); // Default threshold value
  const [isDragging, setIsDragging] = useState(false);

  const yScale = (value) =>
    bottomOffset - (value / maxValue) * (bottomOffset - yOffset);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e) => {
    if (isDragging) {
      const svg = e.target.closest("svg");
      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
      const newThreshold = Math.round(
        maxValue - ((svgP.y - yOffset) / (bottomOffset - yOffset)) * maxValue
      );
      setThreshold(Math.max(0, Math.min(newThreshold, maxValue)));
    }
  };

  useEffect(() => {
    onThresholdChange(threshold);
  }, [threshold, onThresholdChange]);

  return (
    <>
      <line
        x1={xOffset}
        y1={yScale(threshold)}
        x2={chartWidth}
        y2={yScale(threshold)}
        stroke="black"
        strokeWidth="2"
        strokeDasharray="5,5"
        style={{ cursor: "ns-resize" }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      />
      <text
        x={chartWidth - 5}
        y={yScale(threshold) - 5}
        fill="red"
        textAnchor="end"
        fontSize="12"
      >
        Threshold: {threshold}
      </text>
      <rect
        x={xOffset}
        y={yScale(threshold) - 5}
        width={chartWidth - xOffset}
        height="10"
        fill="transparent"
        style={{ cursor: "ns-resize" }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      />
    </>
  );
};

const KafkaDiagramAndChart = () => {
  const consumerGroups = ["Group A", "Group B", "Group C"];
  const topics = ["Topic 1", "Topic 2", "Topic 3"];
  const partitions = [
    "Partition 1",
    "Partition 2",
    "Partition 3",
    "Partition 4",
  ];

  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedPartitions, setSelectedPartitions] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [hoveredLine, setHoveredLine] = useState(null);

  const groupColors = {
    "Group A": "#ff6b6b",
    "Group B": "#4ecdc4",
    "Group C": "#feca57",
  };

  const groupTopicRelations = {
    "Group A": ["Topic 1", "Topic 2", "Topic 3"],
    "Group B": ["Topic 1", "Topic 2"],
    "Group C": ["Topic 1", "Topic 3"],
  };

  const toggleSelection = (item, currentSelection, setSelection) => {
    if (currentSelection.includes(item)) {
      setSelection(currentSelection.filter((i) => i !== item));
    } else {
      setSelection([...currentSelection, item]);
    }
  };

  const isConnectionActive = (group, topic, partition) => {
    const groupActive =
      selectedGroups.length === 0 || selectedGroups.includes(group);
    const topicActive =
      selectedTopics.length === 0 || selectedTopics.includes(topic);
    const partitionActive =
      selectedPartitions.length === 0 || selectedPartitions.includes(partition);
    const isConnected = groupTopicRelations[group].includes(topic);
    return groupActive && topicActive && partitionActive && isConnected;
  };

  const generateMockData = () => {
    const data = [];
    const timePoints = 10;
    const activeGroups =
      selectedGroups.length > 0 ? selectedGroups : consumerGroups;
    const activeTopics = selectedTopics.length > 0 ? selectedTopics : topics;
    const activePartitions =
      selectedPartitions.length > 0 ? selectedPartitions : partitions;

    for (let i = 0; i < timePoints; i++) {
      const point = { time: `T${i}` };
      activeGroups.forEach((group) => {
        activeTopics.forEach((topic) => {
          if (groupTopicRelations[group].includes(topic)) {
            activePartitions.forEach((partition) => {
              const key = `${group}-${topic}-${partition}`;
              point[key] = Math.floor(Math.random() * 1000);
            });
          }
        });
      });
      data.push(point);
    }
    return data;
  };

  const [threshold, setThreshold] = useState(500);

  const handleThresholdChange = (newThreshold) => {
    setThreshold(newThreshold);
    // You can add logic here to trigger alerts when data points cross the threshold
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const handleLineClick = useCallback(
    (key) => {
      // Set modal data for the selected line
      setModalData(
        chartData.map((point) => ({ time: point.time, lag: point[key] }))
      );
      setIsModalOpen(true);
    },
    [chartData]
  );

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setModalData(null);
  }, []);

  const applyFilters = () => {
    const newData = generateMockData();
    setChartData(newData);
  };

  useEffect(() => {
    applyFilters();
  }, []);

  const [tooltipData, setTooltipData] = useState(null);

  const handleLineHover = useCallback((key, time, lag) => {
    setHoveredLine(key);
    setTooltipData({ key, time, lag });
  }, []);

  const handleLineLeave = useCallback(() => {
    setHoveredLine(null);
    setTooltipData(null);
  }, []);

  return (
    <div className="p-4 bg-white">
      <h2 className="text-2xl font-bold mb-4">
        Kafka Relationship Diagram and Consumer Lag Chart
      </h2>

      {/* Filters */}
      <div className="mb-4 flex space-x-4">
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
                    setSelectedPartitions
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

      {/* Relationship Diagram */}
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
                  selectedGroups.length === 0 || selectedGroups.includes(group)
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
                  opacity={isConnectionActive(group, topic, null) ? 1 : 0.4}
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
                  selectedTopics.length === 0 || selectedTopics.includes(topic)
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
                        isConnectionActive(group, topic, partition) ? 1 : 0.4
                      }
                    />
                  ))
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

      {/* Interactive Consumer Lag Chart */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Consumer Lag Chart</h3>
        <svg width="800" height="400" viewBox="0 0 800 400">
          <g // Wrap lines and points in a group for hover events
            onMouseEnter={(e) => {
              const pointIndex = Math.floor((e.clientX - 50) / 70);
              const hoveredKey = Object.keys(chartData[pointIndex]).find(
                (key) => key !== "time"
              );
              const point = chartData[pointIndex];
              handleLineHover(hoveredKey, point.time, point[hoveredKey]);
            }}
            onMouseLeave={handleLineLeave}
          >
            {/* X and Y axes */}
            <line x1="50" y1="350" x2="750" y2="350" stroke="black" />
            <line x1="50" y1="350" x2="50" y2="50" stroke="black" />
            {/* Horizontal gridlines for y-axis steps */}
            {[0, 250, 500, 750, 1000].map((value, index) => (
              <line
                key={index}
                x1="50" // Start at the beginning of the chart area
                y1={350 - value / 3} // Scale the y-value to the chart's coordinates
                x2="750" // Extend to the end of the chart area
                y2={350 - value / 3}
                stroke="lightgray"
                strokeDasharray="4"
              />
            ))}
            {/* Chart lines and points */}
            {chartData.length > 0 &&
              Object.keys(chartData[0])
                .filter((key) => key !== "time")
                .map((key, index) => (
                  <g
                    key={key}
                    onMouseEnter={(e) => {
                      const point = chartData[Math.floor(e.clientX / 70)];
                      handleLineHover(key, point.time, point[key]);
                    }}
                    onMouseLeave={handleLineLeave}
                  >
                    <path
                      d={chartData
                        .map(
                          (point, i) =>
                            `${i === 0 ? "M" : "L"} ${50 + i * 70} ${
                              350 - point[key] / 3
                            }`
                        )
                        .join(" ")}
                      fill="none"
                      stroke={groupColors[key.split("-")[0]]}
                      strokeWidth="2"
                      opacity={
                        hoveredLine ? (hoveredLine === key ? 1 : 0.2) : 1
                      }
                      cursor="pointer" // Indicate interactive area
                      onClick={() => handleLineClick(key)}
                    />
                  </g>
                ))}
            {/* Threshold Line */}
            <ThresholdLine
              chartWidth={750}
              chartHeight={300}
              maxValue={1000}
              onThresholdChange={handleThresholdChange}
              xOffset={50}
              yOffset={17}
              bottomOffset={350}
            />
            {/* X-axis labels */}
            {chartData.map((point, index) => (
              <text key={index} x={50 + index * 70} y="370" textAnchor="middle">
                {point.time}
              </text>
            ))}

            {/* Y-axis labels */}
            {[0, 250, 500, 750, 1000].map((value, index) => (
              <text
                key={index}
                x="40"
                y={350 - value / 3}
                textAnchor="end"
                alignmentBaseline="middle"
              >
                {value}
              </text>
            ))}
            {/* Tooltip */}
            {tooltipData && (
              <div
                className="absolute bg-white border p-2 rounded shadow-md"
                style={{
                  left: Math.min(
                    700, // Limit to chart area width
                    Math.max(
                      50, // Keep within chart area
                      50 + chartData.indexOf(tooltipData.time) * 70 - 50
                    )
                  ),
                  top: Math.min(
                    350, // Limit to chart area height
                    Math.max(50, 350 - tooltipData.lag / 3 - 30) // Keep within chart area and above line
                  ),
                  zIndex: 10,
                }}
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
            )}
          </g>
        </svg>
      </div>

      {/* Legend */}
      <KafkaDataTable chartData={chartData} />
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed bottom-0 left-0 w-full h-96 bg-white border-t shadow-lg">
          <h2 className="text-xl font-bold p-4">Chart Details</h2>
          {/* Display modalData in a table or other format */}
          <table className="min-w-full">
            <thead>
              <tr>
                <th>Time</th>
                <th>Lag</th>
              </tr>
            </thead>
            <tbody>
              {modalData.map((point, index) => (
                <tr key={index}>
                  <td>{point.time}</td>
                  <td>{point.lag}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={handleModalClose}
            className="absolute top-4 right-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            Close
          </button>
        </div>
      )}
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
