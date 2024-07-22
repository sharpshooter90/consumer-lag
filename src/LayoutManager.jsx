// LayoutManager.jsx
import React, { useState } from "react";
import OrderableBlock from "./OrderableBlock";
import LayoutEditor from "./LayoutEditor";
import ShareModal from "./ShareModal";
import { Button } from "@/components/ui/button";

const LayoutManager = ({ initialLayout, children, isEditable = false }) => {
  const [layout, setLayout] = useState(initialLayout);
  const [isEditing, setIsEditing] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const moveBlock = (id, direction) => {
    const currentIndex = layout.findIndex((block) => block.id === id);
    if (
      (direction === "up" && currentIndex === 0) ||
      (direction === "down" && currentIndex === layout.length - 1)
    ) {
      return; // Can't move further in this direction
    }

    const newLayout = [...layout];
    const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    [newLayout[currentIndex], newLayout[swapIndex]] = [
      newLayout[swapIndex],
      newLayout[currentIndex],
    ];
    setLayout(newLayout);
  };

  const updateBlockWidth = (id, width) => {
    setLayout(
      layout.map((block) => (block.id === id ? { ...block, width } : block))
    );
  };

  const deleteBlock = (id) => {
    setLayout(layout.filter((block) => block.id !== id));
  };

  const saveLayout = (asNew = false) => {
    // Implement save logic here
    console.log("Saving layout:", layout, asNew ? "as new" : "overwrite");
  };

  return (
    <div className="">
      {isEditable && (
        <div className="">
          <Button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Finish Editing" : "Edit Layout"}
          </Button>
          {isEditing && (
            <>
              <Button onClick={() => saveLayout(false)} className="ml-2">
                Save
              </Button>
              <Button onClick={() => saveLayout(true)} className="ml-2">
                Save as New
              </Button>
              <Button
                onClick={() => setIsShareModalOpen(true)}
                className="ml-2"
              >
                Share
              </Button>
            </>
          )}
        </div>
      )}
      <div>
        {layout.map((block, index) => (
          <OrderableBlock
            key={block.id}
            block={block}
            index={index}
            isEditing={isEditing}
            updateWidth={updateBlockWidth}
            deleteBlock={deleteBlock}
            moveBlock={moveBlock}
            isFirst={index === 0}
            isLast={index === layout.length - 1}
          >
            {React.Children.toArray(children).find(
              (child) => child.props.id === block.id
            )}
          </OrderableBlock>
        ))}
      </div>
      {isEditing && <LayoutEditor layout={layout} updateLayout={setLayout} />}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
};

export default LayoutManager;
