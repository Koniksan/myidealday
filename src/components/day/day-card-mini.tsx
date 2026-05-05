import { mergeClasses } from "@fluentui/react-components";
import React from "react";
import { StoredTask } from "../../infrastructure/storages/day-storage";
import { useDayCardMiniStyles } from "./day-card-mini-styles";

export interface DayCardMiniProps {
    year: number;
    month: number;
    day: number;
    shortName: string;
    isToday: boolean;
    isWeekend: boolean;
    isOtherMonth?: boolean;
    isSelected: boolean;
    initialTasks?: StoredTask[];
    onClick: () => void;
}

export const DayCardMini: React.FC<DayCardMiniProps> = ({
    day, shortName, isWeekend, isOtherMonth, isSelected, initialTasks = [], onClick,
}) => {
    const styles = useDayCardMiniStyles();

    return (
        <div
            className={mergeClasses(
                styles.card,
                isSelected && styles.selected,
                !isSelected && isWeekend && styles.weekend,
                isOtherMonth && styles.otherMonth,
            )}
            onClick={onClick}
        >
            <span className={mergeClasses(styles.dayName, isSelected && styles.dayNameSelected)}>
                {shortName}
            </span>
            <span className={styles.dayNumber}>{day}</span>
            {initialTasks.length > 0 && (
                <div className={styles.dots}>
                    {initialTasks.map((task, i) => (
                        <span
                            key={i}
                            className={mergeClasses(styles.dot, task.checked && styles.dotChecked)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
