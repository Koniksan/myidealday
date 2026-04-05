import React from "react";

export const Logo: React.FC = () => (
    <svg width="36" height="32" viewBox="0 0 36 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="MiD">
        <defs>
            <linearGradient id="mid-bg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#0D9488"/>
                <stop offset="100%" stopColor="#0EA5E9"/>
            </linearGradient>
        </defs>

        <rect x="3" y="4" width="30" height="24" rx="6" fill="url(#mid-bg)"/>

        <text
            x="18"
            y="21.5"
            fontFamily="system-ui, -apple-system, 'Segoe UI', sans-serif"
            fontSize="13"
            fontWeight="800"
            textAnchor="middle"
            letterSpacing="0.5"
        >
            <tspan fill="#FFFFFF">M</tspan>
            <tspan fill="#FCD34D">i</tspan>
            <tspan fill="#FFFFFF">D</tspan>
        </text>
    </svg>
);
