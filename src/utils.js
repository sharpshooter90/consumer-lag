export const generateMockData = (
  timeSeriesOption,
  selectedGroups,
  selectedTopics,
  selectedPartitions,
  consumerGroups,
  topics,
  partitions,
  groupTopicRelations,
) => {
  const data = [];
  let timePoints;
  let timeInterval;

  switch (timeSeriesOption) {
    case "1h":
      timePoints = 6;
      timeInterval = 10;
      break;
    case "6h":
      timePoints = 36;
      timeInterval = 10;
      break;
    case "24h":
      timePoints = 144;
      timeInterval = 10;
      break;
    case "7d":
      timePoints = 168;
      timeInterval = 60;
      break;
    default:
      timePoints = 36;
      timeInterval = 10;
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
            // Generate a more realistic lag value
            const baseValue = Math.random() * 0.5 + 0.2; // Base value between 0.2 and 0.7
            const trendFactor = i / timePoints; // Increases over time
            const randomSpike = Math.random() < 0.1 ? Math.random() * 2 : 0; // Occasional spikes
            const lagValue = baseValue + baseValue * trendFactor + randomSpike;
            point[key] = Math.min(Math.round(lagValue * 100) / 100, 3); // Round to 2 decimal places, max 3 seconds
          });
        }
      });
    });
    data.push(point);
  }
  return data;
};

export const findNearestDataPoint = (mouseX, chartData, svgElement) => {
  if (!svgElement || chartData.length === 0) return null;

  const svgRect = svgElement.getBoundingClientRect();
  const chartX = mouseX - svgRect.left;
  const xRatio = chartX / svgRect.width;
  const dataIndex = Math.round(xRatio * (chartData.length - 1));

  return chartData[Math.max(0, Math.min(dataIndex, chartData.length - 1))];
};

export const isConnectionActive = (
  group,
  topic,
  partition,
  selectedGroups,
  selectedTopics,
  selectedPartitions,
  groupTopicRelations,
) => {
  const groupActive =
    selectedGroups.length === 0 || selectedGroups.includes(group);
  const topicActive =
    selectedTopics.length === 0 || selectedTopics.includes(topic);
  const partitionActive =
    selectedPartitions.length === 0 || selectedPartitions.includes(partition);
  const isConnected = groupTopicRelations[group].includes(topic);
  return groupActive && topicActive && partitionActive && isConnected;
};
