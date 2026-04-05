import { mergeClasses } from "@fluentui/react-components";
import React from "react";
import { useDayStyles } from "./day-styles";

export interface DayProps {
    day: number;
    shortName: string;
    isToday: boolean;
    isWeekend: boolean;
}

export const Day: React.FC<DayProps> = ({ day, shortName, isToday, isWeekend }) => {
    const styles = useDayStyles();

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
