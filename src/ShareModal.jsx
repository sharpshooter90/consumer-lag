// ShareModal.jsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ShareModal = ({ isOpen, onClose }) => {
  const shareUrl = "https://yourdomain.com/shared-layout/123"; // Replace with actual share URL

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Layout</DialogTitle>
          <DialogDescription>
            Copy the link below to share this layout
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <Input value={shareUrl} readOnly />
          <Button onClick={() => navigator.clipboard.writeText(shareUrl)}>
            Copy
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
