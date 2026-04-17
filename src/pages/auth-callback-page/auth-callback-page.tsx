import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Caption1 } from "@fluentui/react-components";
import { supabase } from "../../infrastructure/storages/supabase-client";
import { PageLayout } from "../../components";

export const AuthCallbackPage: React.FC = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const code = new URLSearchParams(window.location.search).get("code");

        if (code) {
            supabase.auth.exchangeCodeForSession(code)
                .then(({ error }) => {
                    if (error) setError(error.message);
                    else navigate("/user", { replace: true });
                });
        } else {
            const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
                if (event === "SIGNED_IN" && session) {
                    subscription.unsubscribe();
                    navigate("/user", { replace: true });
                }
            });
        }
    }, []);

    return (
        <PageLayout centered>
            {error ? <Caption1>{error}</Caption1> : <Caption1>Verifying your account…</Caption1>}
        </PageLayout>
    );
};
