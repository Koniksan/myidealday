import { Badge, Button, Checkbox, Divider, Input, Menu, MenuItem, MenuList, MenuPopover, MenuTrigger, mergeClasses } from "@fluentui/react-components";
import { AddRegular, DismissRegular, MoreHorizontalRegular } from "@fluentui/react-icons";
import React from "react";
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
    initialTasks?: StoredTask[];
}

export const DayCard: React.FC<DayCardProps> = ({ year, month, day, shortName, isToday, isWeekend, isOtherMonth = false, initialTasks = [] }) => {
    const styles = useDayCardStyles();
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
    } = useDayCard({ year, month, day, initialTasks });

    return (
        <div
            className={mergeClasses(
                styles.card,
                isToday && styles.today,
                !isToday && isWeekend && styles.weekend,
                isOtherMonth && styles.otherMonth,
            )}
            {...(isToday ? { "data-today": "true" } : {})}
        >
            {isToday && (
                <Badge appearance="filled" color="brand" size="small" className={styles.todayBadge}>
                    Today
                </Badge>
            )}

            <DayCardProgress progress={progress} saving={saving} hasTasks={tasks.length > 0} isPast={isPast} />

            <div className={styles.header}>
                <span className={styles.dayName}>{shortName}</span>
                <span className={styles.dayNumber}>{day}</span>
            </div>

            <div className={styles.body}>
                {tasks.filter(t => !t.is_custom).map((task) => {
                    const idx = tasks.indexOf(task);
                    return (
                        <Checkbox
                            key={idx}
                            className={styles.checkboxItem}
                            label={task.label}
                            checked={task.checked}
                            disabled={isReadOnly}
                            onChange={() => toggle(idx)}
                        />
                    );
                })}

                {tasks.some(t => t.is_custom) && tasks.some(t => !t.is_custom) && (
                    <Divider className={styles.customDivider}>Custom</Divider>
                )}

                {tasks.filter(t => t.is_custom).map((task) => {
                    const idx = tasks.indexOf(task);
                    return (
                        <div key={`custom-${idx}`} className={styles.customTaskRow}>
                            <Checkbox
                                className={styles.customTaskCheckbox}
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
                        placeholder="Task name..."
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
                            Add task
                        </MenuItem>
                    </MenuList>
                </MenuPopover>
            </Menu>
        </div>
    );
};
