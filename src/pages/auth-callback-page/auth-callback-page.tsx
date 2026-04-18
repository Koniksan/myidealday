import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Caption1 } from "@fluentui/react-components";
import { supabase } from "../../infrastructure/storages/supabase-client";
import { PageLayout } from "../../components";

export const AuthCallbackPage: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === "SIGNED_IN" && session) {
                navigate("/user", { replace: true });
            } else if (event === "PASSWORD_RECOVERY") {
                navigate("/reset-password", { replace: true });
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <PageLayout centered>
            <Caption1>Verifying your account…</Caption1>
        </PageLayout>
    );
};