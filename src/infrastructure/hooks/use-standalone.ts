import { useEffect, useState } from "react";

const isStandalone = () =>
    ("standalone" in navigator && (navigator as Navigator & { standalone: boolean }).standalone) ||
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches;

export const useStandalone = () => {
    const [standalone, setStandalone] = useState(() => isStandalone());

    useEffect(() => {
        const mq = window.matchMedia("(display-mode: standalone)");
        const onChange = (e: MediaQueryListEvent) => setStandalone(e.matches);
        mq.addEventListener("change", onChange);
        return () => mq.removeEventListener("change", onChange);
    }, []);

    return { isStandalone: standalone };
};
