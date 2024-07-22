// DraggableBlock.jsx
import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLayout } from "./LayoutContext";

const DraggableBlock = ({ block, index, isEditing, children }) => {
  const { moveBlock, updateBlockWidth, deleteBlock } = useLayout();
  const ref = useRef(null);

  const [{ handlerId }, drop] = useDrop({
    accept: "block",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      moveBlock(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "block",
    item: () => {
      return { id: block.id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`${
        isEditing ? "border-2 border-dashed border-gray-300" : ""
      } ${isDragging ? "opacity-50" : ""}`}
      style={{ width: `${block.width}%` }}
      data-handler-id={handlerId}
    >
      {isEditing && (
        <div className="p-2 bg-gray-100 dark:bg-gray-800 flex justify-between items-center cursor-move">
          <span>☰</span>
          <Input
            type="number"
            value={block.width}
            onChange={(e) => updateBlockWidth(block.id, Number(e.target.value))}
            className="w-20 mx-2"
          />
          <Button
            onClick={() => deleteBlock(block.id)}
            variant="destructive"
            size="sm"
          >
            Delete
          </Button>
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};

export default DraggableBlock;
