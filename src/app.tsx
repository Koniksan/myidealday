import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginPage, SignUpPage, UserPage, AuthCallbackPage, NotFoundPage } from "./pages";
import { ThemeProvider } from "./infrastructure/context/theme-context";
import { AuthProvider } from "./infrastructure/context/auth-context";
import { ProtectedRoute } from "./components/protected-route/protected-route";

import "./reset.css";

export const App = () => {
    return (
        <AuthProvider>
            <ThemeProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<LoginPage />} />
                        <Route path="/signup" element={<SignUpPage />} />
                        <Route path="/user" element={<ProtectedRoute><UserPage /></ProtectedRoute>} />
                        <Route path="/auth/callback" element={<AuthCallbackPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </AuthProvider>
    );
};

const rootElement = document.getElementById("root");

if (!rootElement) {
    throw new Error("Root element not found");
}

createRoot(rootElement).render(<App />);