// LayoutManager.jsx
import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DraggableBlock from "./DraggableBlock";
import { useLayout } from "./LayoutContext";

const LayoutManager = ({ children }) => {
  const { layout, isEditing } = useLayout();

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        {layout.map((block, index) => (
          <DraggableBlock
            key={block.id}
            index={index}
            block={block}
            isEditing={isEditing}
          >
            {React.Children.toArray(children).find(
              (child) => child.props.id === block.id
            )}
          </DraggableBlock>
        ))}
      </div>
    </DndProvider>
  );
};

export default LayoutManager;
