import React from "react";
import ReactDOM from "react-dom/client";
import FitCoachApp from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px 0" }}>
      <FitCoachApp />
    </div>
  </React.StrictMode>
);
