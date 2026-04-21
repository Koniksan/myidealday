import { useEffect, useState } from "react";

declare const __BUILD_HASH__: string;

const POLL_INTERVAL_MS = 5 * 60 * 1000;

export const useAppUpdateCheck = (): boolean => {
    const [updateAvailable, setUpdateAvailable] = useState(false);

    useEffect(() => {
        const check = async () => {
            try {
                const res = await fetch(`/version.json?t=${Date.now()}`);
                if (!res.ok) return;
                const { hash } = await res.json();
                if (hash !== __BUILD_HASH__) setUpdateAvailable(true);
            } catch {
                // network error — ignore
            }
        };

        check();
        const id = setInterval(check, POLL_INTERVAL_MS);
        return () => clearInterval(id);
    }, []);

    return updateAvailable;
};
