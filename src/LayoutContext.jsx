// LayoutContext.jsx
import React, { createContext, useState, useContext } from "react";

const LayoutContext = createContext();

export const LayoutProvider = ({ children, initialLayout }) => {
  const [layout, setLayout] = useState(initialLayout);
  const [isEditing, setIsEditing] = useState(false);

  const moveBlock = (dragIndex, hoverIndex) => {
    const newLayout = [...layout];
    const [removed] = newLayout.splice(dragIndex, 1);
    newLayout.splice(hoverIndex, 0, removed);
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

  const value = {
    layout,
    setLayout,
    isEditing,
    setIsEditing,
    moveBlock,
    updateBlockWidth,
    deleteBlock,
  };

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
};
