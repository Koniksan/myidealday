import React from "react";
import { createRoot } from "react-dom/client";

export const App = () => {
    return (
        <div>
            <h1>My Ideal Day</h1>
        </div>
    );
};

const rootElement = document.getElementById("root");

if (!rootElement) {
    throw new Error("Root element not found");
}

createRoot(rootElement).render(<App />);