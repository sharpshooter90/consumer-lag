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
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
  <Card className="w-full mb-4">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" size="icon">
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
      <div className="h-64 w-full max-w-md mx-auto">{children}</div>
    </CardContent>
  </Card>
);
const ChartComponent = ({ data, lines }) => (
  <ResponsiveContainer width="100%" height={250}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="time" />
      <YAxis />
      <Tooltip />
      <Legend />
      {lines.map((line, index) => (
        <Line
          key={index}
          type="monotone"
          dataKey={line.dataKey}
          name={line.name}
          stroke={line.color}
        />
      ))}
    </LineChart>
  </ResponsiveContainer>
);
const SystemMetricsDashboard = () => {
  return (
    <FullScreenWrapper>
      <div className="p-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="flex gap-4">
            <ChartCard title="Average CPU Load">
              <ChartComponent
                data={data}
                lines={[
                  {
                    dataKey: "cpuLoad1m",
                    name: "1m-average",
                    color: "#8884d8",
                  },
                  {
                    dataKey: "cpuLoad15m",
                    name: "15m-average",
                    color: "#82ca9d",
                  },
                ]}
              />
            </ChartCard>

            <ChartCard title="Memory Usage (GiB)">
              <ChartComponent
                data={data}
                lines={[
                  {
                    dataKey: "memBuffered",
                    name: "buffered",
                    color: "#8884d8",
                  },
                  { dataKey: "memCached", name: "cached", color: "#82ca9d" },
                ]}
              />
            </ChartCard>
          </div>
          <ChartCard title="Total Disk I/O (KiB/s)">
            <ChartComponent
              data={data}
              lines={[
                { dataKey: "diskWrite", name: "write", color: "#8884d8" },
                { dataKey: "diskRead", name: "read", color: "#82ca9d" },
              ]}
            />
          </ChartCard>
        </div>
      </div>
    </FullScreenWrapper>
  );
};
export default SystemMetricsDashboard;
