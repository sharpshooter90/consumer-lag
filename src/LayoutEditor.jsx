// LayoutEditor.jsx
import React from "react";
import { Button } from "@/components/ui/button";

const LayoutEditor = ({ layout, updateLayout }) => {
  const addNewBlock = () => {
    const newBlock = {
      id: `block-${Date.now()}`,
      width: 100,
    };
    updateLayout([...layout, newBlock]);
  };

  return (
    <div className="mt-4">
      <Button onClick={addNewBlock}>Add New Block</Button>
    </div>
  );
};

export default LayoutEditor;
