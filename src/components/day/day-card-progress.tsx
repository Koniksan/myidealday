import { mergeClasses, Spinner, tokens } from "@fluentui/react-components";
import { CheckmarkCircle24Filled } from "@fluentui/react-icons";
import React, { useEffect, useState } from "react";
import { useDayCardStyles } from "./day-card-styles";

const CIRCLE_SIZE = 36;
const CIRCLE_RADIUS = 14;
const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

const CIRCLE_SIZE_SMALL = 26;
const CIRCLE_RADIUS_SMALL = 10;
const CIRCUMFERENCE_SMALL = 2 * Math.PI * CIRCLE_RADIUS_SMALL;

const FADE_OUT_MS = 200;

interface DayCardProgressProps {
    progress: number;
    saving: boolean;
    hasTasks: boolean;
    isPast: boolean;
    small?: boolean;
}

export const DayCardProgress: React.FC<DayCardProgressProps> = ({ progress, saving, hasTasks, isPast, small = false }) => {
    const styles = useDayCardStyles();
    const isComplete = progress === 100;
    const shouldRender = saving || progress > 0 || (isPast && hasTasks);
    const [visible, setVisible] = useState(shouldRender);
    const [fadingOut, setFadingOut] = useState(false);


    useEffect(() => {
        if (shouldRender) {
            setVisible(true);
            setFadingOut(false);
        } else if (visible) {
            setFadingOut(true);
            const timer = setTimeout(() => {
                setVisible(false);
                setFadingOut(false);
            }, FADE_OUT_MS);
            return () => clearTimeout(timer);
        }
    }, [shouldRender]);

    if (!visible) return null;

    const circleClass = small
        ? mergeClasses(styles.progressCircleSmall, fadingOut && styles.progressCircleSmallFadeOut)
        : mergeClasses(styles.progressCircle, fadingOut && styles.progressCircleFadeOut);

    if (saving) {
        return <Spinner size="tiny" className={circleClass} />;
    }

    const size = small ? CIRCLE_SIZE_SMALL : CIRCLE_SIZE;
    const radius = small ? CIRCLE_RADIUS_SMALL : CIRCLE_RADIUS;
    const circumference = small ? CIRCUMFERENCE_SMALL : CIRCUMFERENCE;
    const strokeWidth = small ? 2 : 3;

    if (isComplete) {
        return (
            <CheckmarkCircle24Filled
                className={mergeClasses(circleClass, !small && styles.completedCircle)}
                style={{ width: size, height: size, color: "hsl(120, 75%, 42%)" }}
            />
        );
    }

    return (
        <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className={circleClass}
        >
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={tokens.colorNeutralStroke2}
                strokeWidth={strokeWidth}
            />
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={`hsl(${progress * 1.2}, 75%, 42%)`}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - progress / 100)}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                style={{ transition: "stroke-dashoffset 0.4s ease" }}
            />
            {!small && (
                <text
                    x={size / 2}
                    y={size / 2}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="8"
                    fontWeight="600"
                    fill={tokens.colorNeutralForeground2}
                >
                    {Math.round(progress)}%
                </text>
            )}
        </svg>
    );
};
