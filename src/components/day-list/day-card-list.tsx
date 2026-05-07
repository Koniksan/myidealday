import { Button, Text } from "@fluentui/react-components";
import { AddRegular, CalendarTodayRegular, ChevronLeftRegular, ChevronRightRegular, EditRegular } from "@fluentui/react-icons";
import React, { useEffect, useState } from "react";
import { DayCard, DayCardShimmer } from "../day";
import { DayCardMini } from "../day/day-card-mini";
import { useDayCardListStyles } from "./day-card-list-styles";
import { useDayCardList } from "./useDayCardList";
import { DayPlanPanel } from "../day-plan-panel";
import { useHeaderActions } from "../../infrastructure/context/header-actions-context";

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const DayCardList: React.FC = () => {
    const styles = useDayCardListStyles();
    const { days, offsetDays, selectedDay, setSelectedDay, selectedDayProps, monthName, year, planLabels, loading, gridRef, addPlanToAllDays, editPlan, resetPlan, prevMonth, nextMonth, goToToday, updateDayTasks } = useDayCardList();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
    const [isMobile, setIsMobile] = useState(() => window.matchMedia("(max-width: 768px)").matches);
    const { setActions } = useHeaderActions();

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 768px)");
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);

    const openDialog = (mode: "add" | "edit") => {
        setDialogMode(mode);
        setDialogOpen(true);
    };

    const hasExistingPlan = planLabels.length > 0;

    useEffect(() => {
        if (!isMobile) {
            setActions([]);
            return;
        }
        setActions([
            {
                id: "today",
                label: "Today",
                icon: <CalendarTodayRegular />,
                appearance: "secondary" as const,
                onClick: goToToday,
            },
        ]);
        return () => setActions([]);
    }, [hasExistingPlan, isMobile, setActions]);

    const monthNav = (
        <div className={styles.monthNav}>
            <div className={styles.monthNavPill}>
                <Button className={styles.monthNavAction} appearance="subtle" icon={<ChevronLeftRegular />} onClick={prevMonth} />
                <Text weight="semibold" size={400}>{monthName} {year}</Text>
                <Button className={styles.monthNavAction} appearance="subtle" icon={<ChevronRightRegular />} onClick={nextMonth} />
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop layout */}
            <div className={styles.desktopLayout}>
                {monthNav}
                <div className={styles.desktopColumns}>
                    <div className={styles.calendarSide}>
                        <div className={styles.grid} ref={gridRef}>
                            {WEEK_DAYS.map(d => (
                                <div key={d} className={styles.weekDayHeader}>{d}</div>
                            ))}
                            {!loading && offsetDays.map(dayProps => (
                                <DayCardMini
                                    key={`prev-${dayProps.day}`}
                                    {...dayProps}
                                    isOtherMonth
                                    isSelected={false}
                                    onClick={() => {}}
                                />
                            ))}
                            {loading
                                ? Array.from({ length: 30 }, (_, i) => <DayCardShimmer key={i} />)
                                : days.map(dayProps => (
                                    <DayCardMini
                                        key={dayProps.day}
                                        {...dayProps}
                                        isSelected={dayProps.day === selectedDay}
                                        onClick={() => setSelectedDay(dayProps.day)}
                                    />
                                ))
                            }
                        </div>
                    </div>
                    <div className={styles.detailSide}>
                        <DayCard
                            key={`detail-${selectedDayProps.year}-${selectedDayProps.month}-${selectedDayProps.day}`}
                            {...selectedDayProps}
                            isDetailView
                            onTasksChange={(tasks) => updateDayTasks(selectedDay, tasks)}
                        />
                    </div>
                </div>
            </div>

            {/* Mobile: horizontal scroll layout */}
            <div className={styles.mobileLayout}>
                {monthNav}
                <div className={styles.mobileGrid} ref={gridRef}>
                    {loading
                        ? Array.from({ length: 30 }, (_, i) => <DayCardShimmer key={i} />)
                        : days.map(({ year, month, day, shortName, isToday, isWeekend, initialTasks }) => (
                            <DayCard
                                key={day}
                                year={year}
                                month={month}
                                day={day}
                                shortName={shortName}
                                isToday={isToday}
                                isWeekend={isWeekend}
                                initialTasks={initialTasks}
                            />
                        ))
                    }
                </div>
            </div>

            <Button
                shape="circular"
                size="large"
                appearance="primary"
                icon={hasExistingPlan ? <EditRegular /> : <AddRegular />}
                onClick={() => openDialog(hasExistingPlan ? "edit" : "add")}
                className={styles.fab}
            >
                {hasExistingPlan ? "Edit month plan" : "Add month plan"}
            </Button>

            <DayPlanPanel
                open={dialogOpen}
                mode={dialogMode}
                monthName={monthName}
                planLabels={planLabels}
                onClose={() => setDialogOpen(false)}
                addPlanToAllDays={addPlanToAllDays}
                editPlan={editPlan}
                resetPlan={resetPlan}
            />
        </>
    );
};
