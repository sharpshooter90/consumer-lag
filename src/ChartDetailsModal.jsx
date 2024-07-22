import React from "react";
import { XIcon, FolderIcon, LayersIcon, ClockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import SystemMetricsDashboard from "./SystemMetricsDashboard";

const ChartDetailsModal = ({
  isOpen,
  onClose,
  modalData,
  timeSeriesOptions,
}) => {
  if (!modalData) return null;

  const { group, topic, partition, timeSeriesOption, data } = modalData;

  const selectedTimeOption = timeSeriesOptions.find(
    (option) => option.value === timeSeriesOption
  );
  const timeRangeText = selectedTimeOption
    ? selectedTimeOption.label
    : "Unknown time range";

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      snapPoints={[0.5, 1]}
    >
      <DrawerContent className="h-[50%] overflow-auto">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Chart Details</DrawerTitle>
            <DrawerDescription>Consumer lag information</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <Card className="w-full p-6 flex flex-col gap-4 mb-4">
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
                  <span>{timeRangeText}</span>
                </div>
              </div>
            </Card>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="lag" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <SystemMetricsDashboard />
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ChartDetailsModal;
