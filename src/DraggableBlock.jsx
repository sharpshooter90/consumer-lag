// DraggableBlock.jsx
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GripVertical } from "lucide-react"; // Import an icon for the drag handle

const DraggableBlock = ({
  block,
  index,
  isEditing,
  updateWidth,
  deleteBlock,
  children,
}) => {
  return (
    <Draggable draggableId={block.id} index={index}>
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`mb-4 ${
            isEditing ? "border-2 border-dashed border-gray-300" : ""
          }`}
          style={{
            width: `${block.width}%`,
            ...provided.draggableProps.style,
          }}
        >
          {isEditing && (
            <div className="p-2 bg-gray-100 dark:bg-gray-800 flex justify-between items-center">
              <div {...provided.dragHandleProps} className="cursor-move">
                <GripVertical size={20} />
              </div>
              <Input
                type="number"
                value={block.width}
                onChange={(e) => updateWidth(block.id, Number(e.target.value))}
                className="w-20"
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
          <div className="p-4">{children}</div>
        </Card>
      )}
    </Draggable>
  );
};

export default DraggableBlock;
