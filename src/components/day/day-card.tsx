import { mergeClasses } from "@fluentui/react-components";
import React from "react";
import { useDayCardStyles } from "./day-card-styles";

export interface DayCardProps {
    day: number;
    shortName: string;
    isToday: boolean;
    isWeekend: boolean;
}

export const DayCard: React.FC<DayCardProps> = ({ day, shortName, isToday, isWeekend }) => {
    const styles = useDayCardStyles();

    return (
        <div
            className={mergeClasses(
                styles.card,
                isToday && styles.today,
                !isToday && isWeekend && styles.weekend,
            )}
        >
            <span className={mergeClasses(styles.dayName, isToday && styles.dayNameToday)}>
                {shortName}
            </span>
            <span className={mergeClasses(styles.dayNumber, isToday && styles.dayNumberToday)}>
                {day}
            </span>
        </div>
    );
};
