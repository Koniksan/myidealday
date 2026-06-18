import { Badge, Button, Divider, mergeClasses } from "@fluentui/react-components";
import { EditRegular } from "@fluentui/react-icons";
import React from "react";
import { useLocalization } from "../../infrastructure/context/locale-context";
import { PlanItem, StoredTask, TASK_COLORS } from "../../infrastructure";
import { DayPlanPanel } from "../day-plan-panel";
import { formatTimeChip } from "../day-plan-panel/time-picker-panel";
import { DayCardProgress } from "./day-card-progress";
import { useDayCardStyles } from "./day-card-styles";
import { DayTaskItem } from "./day-task-item";
import { useDayCard } from "./use-day-card";

export interface DayCardProps {
    year: number;
    month: number;
    day: number;
    shortName: string;
    isToday: boolean;
    isWeekend: boolean;
    isOtherMonth?: boolean;
    isDetailView?: boolean;
    initialTasks?: StoredTask[];
    onTasksChange?: (tasks: StoredTask[]) => void;
}

export const DayCard: React.FC<DayCardProps> = ({ year, month, day, shortName, isToday, isWeekend, isOtherMonth = false, isDetailView = false, initialTasks = [], onTasksChange }) => {
    const styles = useDayCardStyles();
    const rs = useLocalization();
    const fullDate = new Date(year, month, day).toLocaleString(rs.DateLocale, { weekday: "long", day: "numeric", month: "long" });
    const {
        tasks,
        isPast,
        isReadOnly,
        progress,
        toggle,
        editPanelOpen,
        setEditPanelOpen,
        onSaveFromPanel,
    } = useDayCard({ year, month, day, initialTasks, onTasksChange });

    return (
        <>
            <div
                className={mergeClasses(
                    styles.card,
                    isDetailView && styles.detailCard,
                    isToday && styles.today,
                    !isToday && isWeekend && styles.weekend,
                    isOtherMonth && styles.otherMonth,
                    isReadOnly && styles.readOnly,
                )}
                {...(isToday && !isDetailView ? { "data-today": "true" } : {})}
            >
                {isToday && (
                    <Badge appearance="filled" color="brand" size="small" className={styles.todayBadge}>
                        {rs.Today}
                    </Badge>
                )}

                <DayCardProgress progress={progress} saving={false} hasTasks={tasks.length > 0} isPast={isPast} />

                {isDetailView ? (
                    <div className={styles.detailHeader}>
                        <span className={styles.detailDate}>{fullDate}</span>
                    </div>
                ) : (
                    <div className={styles.header}>
                        <span className={styles.dayName}>{shortName}</span>
                        <span className={styles.dayNumber}>{day}</span>
                    </div>
                )}

                <div className={mergeClasses(styles.body, isDetailView && styles.detailBody)}>
                    {tasks.filter(x => !x.is_custom).map((x, i, arr) => {
                        const idx = tasks.indexOf(x);
                        return (
                            <React.Fragment key={idx}>
                                <DayTaskItem
                                    task={x}
                                    isCustom={false}
                                    isDetailView={isDetailView}
                                    isReadOnly={isReadOnly}
                                    timeStr={formatTimeChip(x)}
                                    priorityLabel={x.color ? rs.TaskColorNames[TASK_COLORS.indexOf(x.color) + 1] : undefined}
                                    onToggle={() => toggle(idx)}
                                />
                                {i < arr.length - 1 && <div className={styles.taskDivider} />}
                            </React.Fragment>
                        );
                    })}

                    {tasks.filter(x => x.is_custom).map((x, i, arr) => {
                        const idx = tasks.indexOf(x);
                        return (
                            <React.Fragment key={`custom-${idx}`}>
                                {i === 0 && <Divider className={styles.customDivider}>{rs.Custom}</Divider>}
                                <DayTaskItem
                                    task={x}
                                    isCustom={true}
                                    isDetailView={isDetailView}
                                    isReadOnly={isReadOnly}
                                    timeStr={formatTimeChip(x)}
                                    priorityLabel={x.color ? rs.TaskColorNames[TASK_COLORS.indexOf(x.color) + 1] : undefined}
                                    onToggle={() => toggle(idx)}
                                />
                                {i < arr.length - 1 && <div className={styles.taskDivider} />}
                            </React.Fragment>
                        );
                    })}

                </div>

                <Button
                    appearance="subtle"
                    size="medium"
                    icon={<EditRegular />}
                    className={styles.menuButton}
                    onClick={() => setEditPanelOpen(true)}
                />
            </div>

            <DayPlanPanel
                open={editPanelOpen}
                mode="editDay"
                dateLabel={fullDate}
                planLabels={tasks as PlanItem[]}
                onClose={() => setEditPanelOpen(false)}
                onSaveDay={onSaveFromPanel}
            />
        </>
    );
};
