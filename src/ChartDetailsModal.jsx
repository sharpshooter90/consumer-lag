import React from "react";
import { Card } from "@/components/ui/card";
import { XIcon, FolderIcon, LayersIcon, ClockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SystemMetricsDashboard from "./SystemMetricsDashboard";

const ChartDetailsModal = ({
  isOpen,
  onClose,
  modalData,
  timeSeriesOptions,
}) => {
  if (!isOpen || !modalData) return null;

  const { group, topic, partition, timeSeriesOption } = modalData;

  const selectedTimeOption = timeSeriesOptions.find(
    (option) => option.value === timeSeriesOption
  );
  const timeRangeText = selectedTimeOption
    ? selectedTimeOption.label
    : "Unknown time range";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chart Details</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-4 top-4"
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <Card className="w-full p-6 flex flex-col gap-4">
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
        <SystemMetricsDashboard />
      </DialogContent>
    </Dialog>
  );
};

export default ChartDetailsModal;
