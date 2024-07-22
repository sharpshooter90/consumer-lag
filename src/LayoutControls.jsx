// LayoutControls.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import { useLayout } from "./LayoutContext";

const LayoutControls = () => {
  const { isEditing, setIsEditing, layout } = useLayout();

  const saveLayout = (asNew = false) => {
    // Implement save logic here
    console.log("Saving layout:", layout, asNew ? "as new" : "overwrite");
  };

  return (
    <div>
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
        </>
      )}
    </div>
  );
};

export default LayoutControls;
