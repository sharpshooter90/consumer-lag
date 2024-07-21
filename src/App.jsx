import React from "react";
import { ThemeProvider } from "next-themes";

import { ThemeToggle } from "./ThemeToggle";
import KafkaDiagramAndChart from "./KafkaDiagramAndChart";

const App = ({ Component, pageProps }) => {
  return (
    <ThemeProvider attribute="class">
      <div className="p-4 bg-white">
        <ThemeToggle />

        <KafkaDiagramAndChart />
      </div>
    </ThemeProvider>
  );
};

export default App;
