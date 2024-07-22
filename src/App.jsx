import React from "react";
import { ThemeProvider } from "next-themes";
import "./styles.css";
import { ThemeToggle } from "./ThemeToggle";
import KafkaDiagramAndChart from "./KafkaDiagramAndChart";

const App = ({ Component, pageProps }) => {
  return (
    <ThemeProvider attribute="class">
      <div className="p-4">
        <ThemeToggle />

        <KafkaDiagramAndChart />
      </div>
    </ThemeProvider>
  );
};

export default App;
