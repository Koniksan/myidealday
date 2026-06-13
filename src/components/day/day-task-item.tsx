import { Checkbox, mergeClasses } from "@fluentui/react-components";
import { ClockRegular, TimerRegular } from "@fluentui/react-icons";
import React from "react";
import { StoredTask } from "../../infrastructure";
import { PriorityBadge } from "../common";
import { useDayCardStyles } from "./day-card-styles";

interface DayTaskItemProps {
    task: StoredTask;
    isCustom: boolean;
    isDetailView: boolean;
    isReadOnly: boolean;
    timeStr: string;
    priorityLabel: string | undefined;
    onToggle: () => void;
}

export const DayTaskItem: React.FC<DayTaskItemProps> = ({ task, isCustom, isDetailView, isReadOnly, timeStr, priorityLabel, onToggle }) => {
    const styles = useDayCardStyles();

    const inner = (
        <>
            <div className={styles.taskRowContent}>
                <Checkbox
                    className={mergeClasses(
                        isCustom ? styles.customTaskCheckbox : styles.checkboxItem,
                        isDetailView && styles.detailCheckboxItem,
                    )}
                    label={
                        <span className={isCustom
                            ? (task.checked ? styles.checkedLabel : undefined)
                            : mergeClasses(styles.checkboxItemLabel, task.checked && styles.checkedLabel)
                        }>
                            {task.label}
                        </span>
                    }
                    checked={task.checked}
                    disabled={isReadOnly}
                    onChange={onToggle}
                />
                {timeStr && (
                    <div className={styles.taskMeta}>
                        <span className={styles.taskTimeLabel}>
                            {task.time_mode === "interval"
                                ? <TimerRegular fontSize={isCustom ? 10 : 12} />
                                : <ClockRegular fontSize={isCustom ? 10 : 12} />
                            }
                            {timeStr}
                        </span>
                    </div>
                )}
            </div>
            {task.color && priorityLabel && (
                <PriorityBadge size={isCustom ? "medium" : "small"} color={task.color} label={priorityLabel} />
            )}
        </>
    );

    if (isCustom) {
        return (
            <div className={mergeClasses(styles.customTaskRow, task.checked && styles.checkedTaskRow)}>
                <div className={styles.customTaskInner}>{inner}</div>
            </div>
        );
    }

    return (
        <div className={mergeClasses(styles.taskRow, task.checked && styles.checkedTaskRow)}>
            {inner}
        </div>
    );
};
