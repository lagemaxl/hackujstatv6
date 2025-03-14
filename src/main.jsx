import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MantineProvider } from "@mantine/core";

import "./index.css";
import "./pages/style/Theme.css";
import "@mantine/core/styles.css";
import 'react-leaflet-markercluster/styles'

import Layout from "./pages/Layout";
import Home from "./pages/Home";
import BudgetMap from "./pages/BudgetMap";
import About from "./pages/About";
import NoPage from "./pages/NoPage";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MantineProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="budget" element={<BudgetMap />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  </StrictMode>
);
