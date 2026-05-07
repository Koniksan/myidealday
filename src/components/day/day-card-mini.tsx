import { mergeClasses } from "@fluentui/react-components";
import React, { useMemo } from "react";
import { StoredTask } from "../../infrastructure/storages/day-storage";
import { DayCardProgress } from "./day-card-progress";
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
    year, month, day, shortName, isToday, isWeekend, isOtherMonth, isSelected, initialTasks = [], onClick,
}) => {
    const styles = useDayCardMiniStyles();

    const isPast = useMemo(() => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        const cardDate = new Date(year, month, day);
        return cardDate <= yesterday;
    }, [year, month, day]);

    const progress = useMemo(() => {
        if (initialTasks.length === 0) return 0;
        return Math.round((initialTasks.filter(t => t.checked).length / initialTasks.length) * 100);
    }, [initialTasks]);

    return (
        <div
            className={mergeClasses(
                styles.card,
                isToday && styles.today,
                isSelected && styles.selected,
                !isSelected && isWeekend && styles.weekend,
                isOtherMonth && styles.otherMonth,
            )}
            {...(isToday ? { "data-today": "true" } : {})}
            onClick={onClick}
        >
            <span className={mergeClasses(styles.dayName, isSelected && styles.dayNameSelected)}>
                {shortName}
            </span>
            <span className={mergeClasses(styles.dayNumber)}>{day}</span>
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
            <DayCardProgress
                progress={progress}
                saving={false}
                hasTasks={initialTasks.length > 0}
                isPast={isPast}
                small
            />
            {isToday && <span className={styles.todayDot} />}
        </div>
    );
};
