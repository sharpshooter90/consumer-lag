import React, { useState, useEffect, useCallback, useRef } from "react";
import { Fullscreen, Share, Info, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FullScreenWrapper from "./FullScreenWrapper";
import ChartDetailsModal from "./ChartDetailsModal";
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
import ChartTooltip from "./ChartTooltip";
import FilterComponent from "./FilterComponent";

const KafkaDiagramAndChart = () => {
  const [activeTab, setActiveTab] = useState("table");
  const [showDiagram, setShowDiagram] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [containerWidth, setContainerWidth] = useState(800); // Default width
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedPartitions, setSelectedPartitions] = useState([]);

  const [chartData, setChartData] = useState([]);
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [hoveredLine, setHoveredLine] = useState(null);
  const [hoveredTableRow, setHoveredTableRow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const [threshold, setThreshold] = useState(500);
  const [timeSeriesOption, setTimeSeriesOption] = useState("6h");

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

  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalData(null);
  };

  const handleOpenModal = (data) => {
    setModalData(data);
    setIsModalOpen(true);
  };
  // const handleModalClose = useCallback(() => {
  //   setIsModalOpen(false);
  //   setModalData(null);
  // }, []);
  const applyFilters = () => {
    const newData = generateMockData(
      timeSeriesOption,
      selectedGroups,
      selectedTopics,
      selectedPartitions,
      consumerGroups,
      topics,
      partitions,
      groupTopicRelations
    );
    setChartData(newData);
  };
  // const handleLineHover = useCallback(
  //   (event, key) => {
  //     if (svgRef.current) {
  //       const svgRect = svgRef.current.getBoundingClientRect();
  //       const mouseX = event.clientX - svgRect.left;
  //       const mouseY = event.clientY - svgRect.top;

  //       const nearestPoint = findNearestDataPoint(
  //         mouseX,
  //         chartData,
  //         svgRef.current
  //       );
  //       if (nearestPoint) {
  //         setTooltipData({
  //           key,
  //           time: nearestPoint.time,
  //           lag: nearestPoint[key],
  //         });
  //         setTooltipPosition({ x: event.clientX, y: event.clientY });
  //         setHoveredLine(key);
  //       }
  //     }
  //   },
  //   [chartData]
  // );

  const handleMouseMove = useCallback(
    (event) => {
      if (svgRef.current && hoveredLine) {
        const svgRect = svgRef.current.getBoundingClientRect();
        const mouseX = event.clientX - svgRect.left;
        const mouseY = event.clientY - svgRect.top;

        const nearestPoint = findNearestDataPoint(
          mouseX,
          chartData,
          svgRef.current
        );
        if (nearestPoint) {
          setTooltipData({
            key: hoveredLine,
            time: nearestPoint.time,
            lag: nearestPoint[hoveredLine],
          });
          // Calculate position relative to the SVG
          setTooltipPosition({
            x: mouseX,
            y: mouseY,
          });
        }
      }
    },
    [chartData, hoveredLine]
  );
  const handleLineHover = useCallback((key) => {
    setHoveredLine(key);
  }, []);

  const handleLineLeave = useCallback(() => {
    setHoveredLine(null);
  }, []);

  const handleTableRowHover = useCallback((key) => {
    setHoveredTableRow(key);
  }, []);

  const handleTableRowLeave = useCallback(() => {
    setHoveredTableRow(null);
  }, []);

  const handleItemClick = useCallback(
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
    [chartData, timeSeriesOption]
  );

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    // Don't reset modalData here
  }, []);

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
    <FilterComponent
      consumerGroups={consumerGroups}
      topics={topics}
      partitions={partitions}
      selectedGroups={selectedGroups}
      selectedTopics={selectedTopics}
      selectedPartitions={selectedPartitions}
      setSelectedGroups={setSelectedGroups}
      setSelectedTopics={setSelectedTopics}
      setSelectedPartitions={setSelectedPartitions}
      applyFilters={applyFilters}
    />
  );
  const renderDiagram = () => (
    <div>
      <Card className="mb-4">
        <CardHeader className="flex-row gap-4 items-center">
          <CardTitle>Visualize relationship (internal only)</CardTitle>
          <Switch checked={showDiagram} onCheckedChange={setShowDiagram} />
        </CardHeader>
        <CardContent className="flex space-x-4">
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
                          : 0.1
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
                            groupTopicRelations
                          )
                            ? 1
                            : 0.1
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
                          : 0.1
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
                                groupTopicRelations
                              )
                                ? 1
                                : 0.1
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
                          : 0.1
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
        </CardContent>
      </Card>
    </div>
  );
  const renderChart = (
    hoveredTableRow,
    onLineHover,
    onLineLeave,
    onLineClick
  ) => (
    <FullScreenWrapper>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Consumer Lag Chart</CardTitle>
          <div className="flex items-center space-x-2">
            <Select
              value={timeSeriesOption}
              onValueChange={setTimeSeriesOption}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                {timeSeriesOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={handleFullScreenClick}
            >
              <Fullscreen className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Share className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Info className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div
            ref={containerRef}
            className="w-full h-[400px] relative"
            onMouseMove={handleMouseMove}
            onMouseLeave={onLineLeave}
          >
            <svg
              ref={svgRef}
              width="100%"
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
                                point[key]
                              )}`
                          )
                          .join(" ")}
                        fill="none"
                        stroke={groupColors[key.split("-")[0]]}
                        strokeWidth="2"
                        opacity={
                          hoveredLine || hoveredTableRow
                            ? hoveredLine === key || hoveredTableRow === key
                              ? 1
                              : 0.1
                            : 1
                        }
                        cursor="pointer"
                        onClick={() => onLineClick(key)}
                        onMouseEnter={() => onLineHover(key)}
                        onMouseLeave={onLineLeave}
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
              </g>
            </svg>
            <ChartTooltip
              data={tooltipData}
              position={tooltipPosition}
              visible={!!tooltipData}
            />
          </div>
        </CardContent>
      </Card>
    </FullScreenWrapper>
  );
  const renderTabs = () => (
    <Tabs defaultValue="table" className="mt-8">
      <TabsList>
        <TabsTrigger value="table">Consumer Lag Data</TabsTrigger>
        <TabsTrigger value="placeholder">
          Selected Chart Item Details
        </TabsTrigger>
      </TabsList>
      <TabsContent value="table">
        <KafkaDataTable
          chartData={chartData}
          onRowHover={handleTableRowHover}
          onRowLeave={handleTableRowLeave}
          onItemClick={handleItemClick}
        />
      </TabsContent>
      <TabsContent value="placeholder">
        <SystemMetricsDashboard />
      </TabsContent>
    </Tabs>
  );
  const renderModal = () => (
    <div>
      <ChartDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        modalData={modalData}
        timeSeriesOptions={timeSeriesOptions}
      />
    </div>
  );

  return (
    <div className="p-4 bg-white flex flex-col gap-4">
      <h2 className="text-2xl font-bold mb-4">
        Message Queue Monitoring / Kafka
      </h2>
      {/* Filters */}
      {renderFilters()}

      {/* Relationship Diagram */}
      {renderDiagram()}

      {/* Interactive Consumer Lag Chart */}
      {renderChart(
        hoveredTableRow,
        handleLineHover,
        handleLineLeave,
        handleItemClick
      )}

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
