import { mergeClasses, Spinner, tokens } from "@fluentui/react-components";
import { CheckmarkCircle24Filled } from "@fluentui/react-icons";
import React from "react";
import { useDayCardStyles } from "./day-card-styles";

const CIRCLE_SIZE = 36;
const CIRCLE_RADIUS = 14;
const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

interface DayCardProgressProps {
    progress: number;
    saving: boolean;
}

export const DayCardProgress: React.FC<DayCardProgressProps> = ({ progress, saving }) => {
    const styles = useDayCardStyles();
    const isComplete = progress === 100;

    if (saving) {
        return <Spinner size="tiny" className={styles.progressCircle} />;
    }

    if (progress === 0) {
        return null;
    }

    if (isComplete) {
        return (
            <CheckmarkCircle24Filled
                className={mergeClasses(styles.progressCircle, styles.completedCircle)}
                style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE, color: "hsl(120, 75%, 42%)" }}
            />
        );
    }

    return (
        <svg
            width={CIRCLE_SIZE}
            height={CIRCLE_SIZE}
            viewBox={`0 0 ${CIRCLE_SIZE} ${CIRCLE_SIZE}`}
            className={styles.progressCircle}
        >
            <circle
                cx={CIRCLE_SIZE / 2}
                cy={CIRCLE_SIZE / 2}
                r={CIRCLE_RADIUS}
                fill="none"
                stroke={tokens.colorNeutralStroke2}
                strokeWidth="3"
            />
            <circle
                cx={CIRCLE_SIZE / 2}
                cy={CIRCLE_SIZE / 2}
                r={CIRCLE_RADIUS}
                fill="none"
                stroke={`hsl(${progress * 1.2}, 75%, 42%)`}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={CIRCUMFERENCE * (1 - progress / 100)}
                transform={`rotate(-90 ${CIRCLE_SIZE / 2} ${CIRCLE_SIZE / 2})`}
                style={{ transition: "stroke-dashoffset 0.4s ease" }}
            />
            <text
                x={CIRCLE_SIZE / 2}
                y={CIRCLE_SIZE / 2}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="8"
                fontWeight="600"
                fill={tokens.colorNeutralForeground2}
            >
                {Math.round(progress)}%
            </text>
        </svg>
    );
};
