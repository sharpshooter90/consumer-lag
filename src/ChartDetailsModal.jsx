import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import SystemMetricsDashboard from "./SystemMetricsDashboard";

const ChartDetailsModal = ({
  isOpen,
  onClose,
  modalData,
  timeSeriesOptions,
}) => {
  if (!modalData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chart Details</DialogTitle>
          <DialogDescription>
            Detailed information about the selected chart item.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Group:</span>
            <span className="col-span-3">{modalData.group}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Topic:</span>
            <span className="col-span-3">{modalData.topic}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Partition:</span>
            <span className="col-span-3">{modalData.partition}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Time Range:</span>
            <span className="col-span-3">
              {
                timeSeriesOptions.find(
                  (opt) => opt.value === modalData.timeSeriesOption,
                )?.label
              }
            </span>
          </div>
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          <SystemMetricsDashboard />
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChartDetailsModal;
