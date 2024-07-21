import React, { useState } from "react";
import { Fullscreen } from "lucide-react";

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

export default FullScreenWrapper;
