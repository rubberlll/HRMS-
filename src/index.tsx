import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { RouterProvider } from "react-router-dom";
import router from "../router";
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <Suspense fallback={<div>加载中...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  </React.StrictMode>
);
