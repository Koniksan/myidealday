import { Badge, Button, Checkbox, Divider, Input, Menu, MenuItem, MenuList, MenuPopover, MenuTrigger, mergeClasses } from "@fluentui/react-components";
import { AddRegular, DismissRegular, MoreHorizontalRegular } from "@fluentui/react-icons";
import React from "react";
import { useLocalization } from "../../infrastructure/context/locale-context";
import { StoredTask } from "../../infrastructure/storages/day-storage";
import { DayCardProgress } from "./day-card-progress";
import { useDayCardStyles } from "./day-card-styles";
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
        adding,
        setAdding,
        draft,
        setDraft,
        saving,
        isPast,
        isReadOnly,
        progress,
        toggle,
        removeCustomTask,
        commitDraft,
        onKeyDown,
    } = useDayCard({ year, month, day, initialTasks, onTasksChange });

    return (
        <div
            className={mergeClasses(
                styles.card,
                isDetailView && styles.detailCard,
                isToday && styles.today,
                !isToday && isWeekend && styles.weekend,
                isOtherMonth && styles.otherMonth,
            )}
            {...(isToday && !isDetailView ? { "data-today": "true" } : {})}
        >
            {isToday && (
                <Badge appearance="filled" color="brand" size="small" className={styles.todayBadge}>
                    {rs.Today}
                </Badge>
            )}

            <DayCardProgress progress={progress} saving={saving} hasTasks={tasks.length > 0} isPast={isPast} />

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
                {tasks.filter(t => !rs.Is_custom).map((task) => {
                    const idx = tasks.indexOf(task);
                    return (
                        <Checkbox
                            key={idx}
                            className={mergeClasses(styles.checkboxItem, isDetailView && styles.detailCheckboxItem)}
                            label={task.label}
                            checked={task.checked}
                            disabled={isReadOnly}
                            onChange={() => toggle(idx)}
                        />
                    );
                })}

                {tasks.some(t => rs.Is_custom) && tasks.some(t => !rs.Is_custom) && (
                    <Divider className={styles.customDivider}>{rs.Custom}</Divider>
                )}

                {tasks.filter(t => rs.Is_custom).map((task) => {
                    const idx = tasks.indexOf(task);
                    return (
                        <div key={`custom-${idx}`} className={styles.customTaskRow}>
                            <Checkbox
                                className={mergeClasses(styles.customTaskCheckbox, isDetailView && styles.detailCheckboxItem)}
                                label={task.label}
                                checked={task.checked}
                                disabled={isReadOnly}
                                onChange={() => toggle(idx)}
                            />
                            {task.id && (
                                <button
                                    className={styles.deleteTaskButton}
                                    onClick={() => removeCustomTask(task.id!)}
                                    onPointerDown={(e) => e.stopPropagation()}
                                >
                                    <DismissRegular fontSize={12} />
                                </button>
                            )}
                        </div>
                    );
                })}

                {adding && (
                    <Input
                        autoFocus
                        size="small"
                        className={styles.addInput}
                        placeholder={rs.TaskNamePlaceholder}
                        value={draft}
                        onChange={(_, d) => setDraft(d.value)}
                        onKeyDown={onKeyDown}
                        onBlur={commitDraft}
                    />
                )}
            </div>

            <Menu>
                <MenuTrigger disableButtonEnhancement>
                    <Button
                        appearance="subtle"
                        size="small"
                        icon={<MoreHorizontalRegular />}
                        className={styles.menuButton}
                    />
                </MenuTrigger>
                <MenuPopover>
                    <MenuList>
                        <MenuItem icon={<AddRegular />} onClick={() => setAdding(true)}>
                            {rs.AddTask}
                        </MenuItem>
                    </MenuList>
                </MenuPopover>
            </Menu>
        </div>
    );
};
