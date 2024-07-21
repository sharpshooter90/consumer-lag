import React from "react";
import { Button } from "@/components/ui/button";

import KafkaDiagramAndChart from "./KafkaDiagramAndChart";

const App = () => {
  return (
    <div className="p-4 bg-white">
      <Button>Shadcn button</Button>
      <KafkaDiagramAndChart />
    </div>
  );
};

export default App;
