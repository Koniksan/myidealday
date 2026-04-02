import React from "react";
import { createRoot } from "react-dom/client";
import { LoginPage } from "./pages";
import { ThemeProvider } from "./context/theme-context";

import "./reset.css";

export const App = () => {
    return (
        <ThemeProvider>
            <LoginPage />
        </ThemeProvider>
    );
};

const rootElement = document.getElementById("root");

if (!rootElement) {
    throw new Error("Root element not found");
}

createRoot(rootElement).render(<App />);