import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { Fullscreen, Share, Info, MoreVertical } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    time: "10:30 AM",
    cpuLoad1m: 2.5,
    cpuLoad15m: 1.8,
    memBuffered: 4,
    memCached: 1.5,
    diskWrite: 800,
    diskRead: 600,
  },
  {
    time: "11:00 AM",
    cpuLoad1m: 2.7,
    cpuLoad15m: 1.9,
    memBuffered: 4.2,
    memCached: 1.6,
    diskWrite: 850,
    diskRead: 550,
  },
  {
    time: "11:30 AM",
    cpuLoad1m: 3,
    cpuLoad15m: 1.5,
    memBuffered: 4.8,
    memCached: 1.7,
    diskWrite: 950,
    diskRead: 500,
  },
  {
    time: "12:00 PM",
    cpuLoad1m: 2.8,
    cpuLoad15m: 1.4,
    memBuffered: 5,
    memCached: 1.8,
    diskWrite: 1000,
    diskRead: 490,
  },
  {
    time: "12:30 PM",
    cpuLoad1m: 2.6,
    cpuLoad15m: 1.6,
    memBuffered: 4.7,
    memCached: 1.9,
    diskWrite: 900,
    diskRead: 520,
  },
  {
    time: "01:00 PM",
    cpuLoad1m: 2.7,
    cpuLoad15m: 1.7,
    memBuffered: 4.5,
    memCached: 2,
    diskWrite: 850,
    diskRead: 550,
  },
  {
    time: "01:30 PM",
    cpuLoad1m: 2.9,
    cpuLoad15m: 1.8,
    memBuffered: 4.8,
    memCached: 2.1,
    diskWrite: 920,
    diskRead: 580,
  },
  {
    time: "02:00 PM",
    cpuLoad1m: 3.1,
    cpuLoad15m: 2,
    memBuffered: 5.1,
    memCached: 2.2,
    diskWrite: 980,
    diskRead: 600,
  },
  {
    time: "02:45 PM",
    cpuLoad1m: 3.3,
    cpuLoad15m: 3,
    memBuffered: 5.2,
    memCached: 2.3,
    diskWrite: 1050,
    diskRead: 650,
  },
];

const ChartCard = ({ title, children }) => (
  <div className="w-full mb-4">
    <div>{title}</div>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  </div>
);

const SystemMetricsDashboard = () => {
  return (
    <FullScreenWrapper>
      <div className="p-4 space-y-4">
        <div className="flex mb-16">
          <ChartCard title="Average CPU Load">
            <div className="flex justify-end mb-2 space-x-2">
              <button
                aria-label="full screen"
                className="p-2 hover:bg-gray-200 rounded"
              >
                <Fullscreen className="w-5 h-5" />
              </button>
              <button
                aria-label="share"
                className="p-2 hover:bg-gray-200 rounded"
              >
                <Share className="w-5 h-5" />
              </button>
              <button
                aria-label="info"
                className="p-2 hover:bg-gray-200 rounded"
              >
                <Info className="w-5 h-5" />
              </button>
              <button
                aria-label="more"
                className="p-2 hover:bg-gray-200 rounded"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="cpuLoad1m"
                name="1m-average"
                stroke="#8884d8"
              />
              <Line
                type="monotone"
                dataKey="cpuLoad15m"
                name="15m-average"
                stroke="#82ca9d"
              />
            </LineChart>
          </ChartCard>

          <ChartCard title="Memory Usage (GiB)">
            <div className="flex justify-end mb-2 space-x-2">
              <button
                aria-label="full screen"
                className="p-2 hover:bg-gray-200 rounded"
              >
                <Fullscreen className="w-5 h-5" />
              </button>
              <button
                aria-label="share"
                className="p-2 hover:bg-gray-200 rounded"
              >
                <Share className="w-5 h-5" />
              </button>
              <button
                aria-label="info"
                className="p-2 hover:bg-gray-200 rounded"
              >
                <Info className="w-5 h-5" />
              </button>
              <button
                aria-label="more"
                className="p-2 hover:bg-gray-200 rounded"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="memBuffered"
                name="buffered"
                stroke="#8884d8"
              />
              <Line
                type="monotone"
                dataKey="memCached"
                name="cached"
                stroke="#82ca9d"
              />
            </LineChart>
          </ChartCard>
        </div>

        <ChartCard title="Total Disk I/O (KiB/s)">
          <div className="flex justify-end mb-2 space-x-2">
            <button
              aria-label="full screen"
              className="p-2 hover:bg-gray-200 rounded"
            >
              <Fullscreen className="w-5 h-5" />
            </button>
            <button
              aria-label="share"
              className="p-2 hover:bg-gray-200 rounded"
            >
              <Share className="w-5 h-5" />
            </button>
            <button aria-label="info" className="p-2 hover:bg-gray-200 rounded">
              <Info className="w-5 h-5" />
            </button>
            <button aria-label="more" className="p-2 hover:bg-gray-200 rounded">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="diskWrite"
              name="write"
              stroke="#8884d8"
            />
            <Line
              type="monotone"
              dataKey="diskRead"
              name="read"
              stroke="#82ca9d"
            />
          </LineChart>
        </ChartCard>
      </div>
    </FullScreenWrapper>
  );
};

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
        }),
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
          item.partition.toLowerCase().includes(lowerQuery),
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
    currentPage * itemsPerPage,
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
const FullScreenWrapper = ({ children }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
    setIsFullScreen(true);
  };

  const handleClose = () => {
    setIsFullScreen(false);
  };

  return (
    <div className="relative">
      {!isFullScreen && (
        <div className="absolute top-2 right-2 z-10">
          <button
            aria-label="full screen"
            className="p-2 hover:bg-gray-200 rounded"
            onClick={handleFullScreenClick}
          >
            <Fullscreen className="w-5 h-5" />
          </button>
        </div>
      )}

      {isFullScreen ? (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          <div className="flex justify-end p-4">
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
            >
              Close
            </button>
          </div>
          <div className="flex-grow m-[50px]">{children}</div>
        </div>
      ) : (
        children
      )}
    </div>
  );
};

const KafkaDiagramAndChart = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [containerWidth, setContainerWidth] = useState(800); // Default width
  const containerRef = useRef(null);
  const chartWidth = 800; // You can adjust this value
  const chartHeight = 400; // You can adjust this value
  const margin = { top: 20, right: 50, bottom: 70, left: 50 };
  const PADDING = {
    top: 20,
    right: 30,
    bottom: 50,
    left: 60,
  };
  const xScale = (index) =>
    PADDING.left +
    (index / (chartData.length - 1)) *
      (containerWidth - PADDING.left - PADDING.right);

  const yScale = (value) =>
    chartHeight -
    PADDING.bottom -
    (value / 1000) * (chartHeight - PADDING.top - PADDING.bottom);

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

  const svgRef = useRef(null);
  const findNearestDataPoint = (mouseX, chartData, svgElement) => {
    if (!svgElement || chartData.length === 0) return null;

    const svgRect = svgElement.getBoundingClientRect();
    const chartX = mouseX - svgRect.left;
    const xRatio = chartX / svgRect.width;
    const dataIndex = Math.round(xRatio * (chartData.length - 1));

    return chartData[Math.max(0, Math.min(dataIndex, chartData.length - 1))];
  };

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

  const handleFullScreenClick = () => {
    setIsFullScreen(true);
  };
  const generateMockData = () => {
    const data = [];
    let timePoints;
    let timeInterval;

    switch (timeSeriesOption) {
      case "1h":
        timePoints = 60;
        timeInterval = 1;
        break;
      case "6h":
        timePoints = 72;
        timeInterval = 5;
        break;
      case "24h":
        timePoints = 96;
        timeInterval = 15;
        break;
      case "7d":
        timePoints = 168;
        timeInterval = 60;
        break;
      default:
        timePoints = 72;
        timeInterval = 5;
    }

    const now = new Date();

    const activeGroups =
      selectedGroups.length > 0 ? selectedGroups : consumerGroups;
    const activeTopics = selectedTopics.length > 0 ? selectedTopics : topics;
    const activePartitions =
      selectedPartitions.length > 0 ? selectedPartitions : partitions;

    for (let i = 0; i < timePoints; i++) {
      const pointTime = new Date(now - (timePoints - i) * timeInterval * 60000);
      const point = {
        time: pointTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

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

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setModalData(null);
  }, []);

  const applyFilters = () => {
    const newData = generateMockData();
    setChartData(newData);
  };

  // tooltip for consumer lag chart
  const [tooltipData, setTooltipData] = useState(null);

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

  const [timeSeriesOption, setTimeSeriesOption] = useState("6h");
  const timeSeriesOptions = [
    { value: "1h", label: "Last 1 hour" },
    { value: "6h", label: "Last 6 hours" },
    { value: "24h", label: "Last 24 hours" },
    { value: "7d", label: "Last 7 days" },
  ];

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
      {/* Interactive Consumer Lag Chart */}
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
            <button
              aria-label="share"
              className="p-2 hover:bg-gray-200 rounded"
            >
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

                {/* Y-axis labels */}
                {[0, 250, 500, 750, 1000].map((value) => (
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
      {/* Legend */}
      <KafkaDataTable chartData={chartData} />
      {/* Modal */}
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
