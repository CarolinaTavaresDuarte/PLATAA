import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthProvider } from "./context/AuthContext";
import App from "./pages/App";
import Dashboard from "./pages/Dashboard";
import Tests from "./pages/Tests";    
import Dados from "./pages/Dados";
import "./styles.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/triagens" element={<Tests />} />   
            <Route path="/dados" element={<Dados />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
