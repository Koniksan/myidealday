import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../infrastructure/context/auth-context";

interface Props {
    children: React.ReactNode;
}

export const ProtectedRoute: React.FC<Props> = ({ children }) => {
    const { isLoggedIn, isLoading } = useAuth();

    if (isLoading) return null;
    if (!isLoggedIn) return <Navigate to="/" replace />;

    return <>{children}</>;
};
