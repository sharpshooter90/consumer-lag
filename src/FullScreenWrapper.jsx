import React, { useState } from "react";
import { Fullscreen, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
          <Button
            variant="outline"
            size="icon"
            onClick={handleFullScreenClick}
            aria-label="full screen"
          >
            <Fullscreen className="h-4 w-4" />
          </Button>
        </div>
      )}

      {isFullScreen ? (
        <Card className="fixed inset-0 z-50 flex flex-col dark:bg-gray-800">
          <div className="flex justify-end p-4">
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardContent className="flex-grow m-[50px]">{children}</CardContent>
        </Card>
      ) : (
        children
      )}
    </div>
  );
};

export default FullScreenWrapper;
