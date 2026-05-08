import { Locale } from "../../../infrastructure/context/translations";
import React from "react";

export const FlagUS: React.FC = () => (
    <svg width="20" height="14" viewBox="0 0 20 14" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: 2, flexShrink: 0 }}>
        <rect width="20" height="14" fill="#B22234" />
        <rect y="1.08" width="20" height="1.08" fill="#fff" />
        <rect y="3.23" width="20" height="1.08" fill="#fff" />
        <rect y="5.38" width="20" height="1.08" fill="#fff" />
        <rect y="7.54" width="20" height="1.08" fill="#fff" />
        <rect y="9.69" width="20" height="1.08" fill="#fff" />
        <rect y="11.85" width="20" height="1.08" fill="#fff" />
        <rect width="8" height="7.54" fill="#3C3B6E" />
    </svg>
);

export const FlagRU: React.FC = () => (
    <svg width="20" height="14" viewBox="0 0 20 14" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: 2, flexShrink: 0 }}>
        <rect width="20" height="14" fill="#CE2028" />
        <rect width="20" height="9.33" fill="#0039A6" />
        <rect width="20" height="4.67" fill="#fff" />
    </svg>
);

export const FLAGS: Record<Locale, React.FC> = { en: FlagUS, ru: FlagRU };
