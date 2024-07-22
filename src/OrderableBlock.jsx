// OrderableBlock.jsx
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronUp, ChevronDown } from "lucide-react";

const OrderableBlock = ({
  block,
  index,
  isEditing,
  updateWidth,
  deleteBlock,
  moveBlock,
  isFirst,
  isLast,
  children,
}) => {
  return (
    <div
      className={`${
        isEditing ? "mb-4 border-2 border-dashed border-gray-300" : ""
      }`}
      style={{ width: `${block.width}%` }}
    >
      {isEditing && (
        <div className="p-2 bg-gray-100 dark:bg-gray-800 flex justify-between items-center">
          <div>
            <Button
              onClick={() => moveBlock(block.id, "up")}
              disabled={isFirst}
              size="sm"
              variant="outline"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => moveBlock(block.id, "down")}
              disabled={isLast}
              size="sm"
              variant="outline"
              className="ml-1"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
          <Input
            type="number"
            value={block.width}
            onChange={(e) => updateWidth(block.id, Number(e.target.value))}
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
      <div className="mb-4">{children}</div>
    </div>
  );
};

export default OrderableBlock;
