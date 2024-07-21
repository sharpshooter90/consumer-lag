import React from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import KafkaDiagramAndChart from "./KafkaDiagramAndChart";

const App = () => {
  return (
    <div className="p-4 bg-white">
      <ThemeToggle />
      <KafkaDiagramAndChart />
    </div>
  );
};

export default App;
