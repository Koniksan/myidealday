import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Caption1 } from "@fluentui/react-components";
import { supabase } from "../../infrastructure/storages/supabase-client";
import { PageLayout } from "../../components";

export const AuthCallbackPage: React.FC = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let done = false;
        const redirect = () => { if (!done) { done = true; navigate("/user", { replace: true }); } };

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) redirect();
            else if (_event === "SIGNED_OUT") setError("Verification failed. Please try again.");
        });

        supabase.auth.getSession().then(({ data: { session }, error }) => {
            if (error) setError(error.message);
            else if (session) redirect();
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <PageLayout centered>
            {error ? <Caption1>{error}</Caption1> : <Caption1>Verifying your account…</Caption1>}
        </PageLayout>
    );
};
