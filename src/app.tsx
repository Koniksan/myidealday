import { Toaster } from "@fluentui/react-components";
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginPage, SignUpPage, UserPage, AuthCallbackPage, NotFoundPage } from "./pages";
import { ThemeProvider } from "./infrastructure/context/theme-context";
import { AuthProvider } from "./infrastructure/context/auth-context";
import { LocaleProvider } from "./infrastructure/context/locale-context";
import { NotificationProvider } from "./infrastructure/context/notification-context";
import { NotificationBadgeProvider } from "./infrastructure/context/notification-badge-context";
import { ProtectedRoute } from "./components/protected-route/protected-route";

import "./reset.css";

export const App = () => {
    return (
        <LocaleProvider>
        <AuthProvider>
            <ThemeProvider>
                <NotificationBadgeProvider>
                <NotificationProvider>
                <Toaster toasterId="app" position="bottom-end" />
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<LoginPage />} />
                        <Route path="/signup" element={<SignUpPage />} />
                        <Route path="/user" element={<ProtectedRoute><UserPage /></ProtectedRoute>} />
                        <Route path="/auth/callback" element={<AuthCallbackPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </BrowserRouter>
                </NotificationProvider>
                </NotificationBadgeProvider>
            </ThemeProvider>
        </AuthProvider>
        </LocaleProvider>
    );
};

const rootElement = document.getElementById("root");

if (!rootElement) {
    throw new Error("Root element not found");
}

createRoot(rootElement).render(<App />);