import { useEffect, useState } from "react";

export const useScreenSize = () => {
    const [isMobile, setIsMobile] = useState(() => window.matchMedia("(max-width: 768px)").matches);
    const [isTablet, setIsTablet] = useState(() => window.matchMedia("(max-width: 1024px)").matches);

    useEffect(() => {
        const mqMobile = window.matchMedia("(max-width: 768px)");
        const mqTablet = window.matchMedia("(max-width: 1024px)");
        const onMobile = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        const onTablet = (e: MediaQueryListEvent) => setIsTablet(e.matches);
        mqMobile.addEventListener("change", onMobile);
        mqTablet.addEventListener("change", onTablet);
        return () => {
            mqMobile.removeEventListener("change", onMobile);
            mqTablet.removeEventListener("change", onTablet);
        };
    }, []);

    return { isMobile, isTablet };
};
