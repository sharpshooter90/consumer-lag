import React from "react";
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
import FullScreenWrapper from "./FullScreenWrapper";
import { Fullscreen, Share, Info, MoreVertical } from "lucide-react";
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
export default SystemMetricsDashboard;
