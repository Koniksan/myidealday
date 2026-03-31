import React from "react";
import { createRoot } from "react-dom/client";
import { LoginPage } from "./pages";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";

import "./reset.css";

export const App = () => {
    return (
        <FluentProvider theme={webLightTheme}>
            <LoginPage />
        </FluentProvider>
    );
};

const rootElement = document.getElementById("root");

if (!rootElement) {
    throw new Error("Root element not found");
}

createRoot(rootElement).render(<App />);