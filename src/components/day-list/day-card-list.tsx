import { Button, Text } from "@fluentui/react-components";
import { AddRegular, CalendarTodayRegular, ChevronLeftRegular, ChevronRightRegular, EditRegular } from "@fluentui/react-icons";
import React, { useEffect, useRef, useState } from "react";
import { DayCard, DayCardShimmer } from "../day";
import { DayCardMini } from "../day/day-card-mini";
import { useDayCardListStyles } from "./day-card-list-styles";
import { useDayCardList } from "./useDayCardList";
import { DayPlanPanel } from "../day-plan-panel";
import { useHeaderActions } from "../../infrastructure/context/header-actions-context";

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const DayCardList: React.FC = () => {
    const styles = useDayCardListStyles();
    const { days, offsetDays, selectedDay, setSelectedDay, selectedDayProps, monthName, year, planLabels, loading, gridRef, addPlanToAllDays, editPlan, resetPlan, prevMonth, nextMonth, goToToday } = useDayCardList();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
    const actionsRef = useRef<HTMLDivElement>(null);
    const [actionsInView, setActionsInView] = useState(true);
    const { setActions } = useHeaderActions();

    const openDialog = (mode: "add" | "edit") => {
        setDialogMode(mode);
        setDialogOpen(true);
    };

    const hasExistingPlan = planLabels.length > 0;

    useEffect(() => {
        const target = actionsRef.current;
        if (!target) return;
        const headerHeight = document.querySelector("header")?.getBoundingClientRect().height ?? 44;
        const observer = new IntersectionObserver(
            ([entry]) => setActionsInView(entry.isIntersecting),
            { rootMargin: `-${Math.ceil(headerHeight)}px 0px 0px 0px`, threshold: 0 },
        );
        observer.observe(target);
        return () => observer.disconnect();
    }, [loading]);

    useEffect(() => {
        if (actionsInView) {
            setActions([]);
            return;
        }
        setActions([
            {
                id: "today",
                label: "Today",
                icon: <CalendarTodayRegular />,
                appearance: "secondary",
                onClick: goToToday,
            },
            {
                id: "edit-plan",
                label: hasExistingPlan ? "Edit plan" : "Add plan",
                icon: hasExistingPlan ? <EditRegular /> : <AddRegular />,
                appearance: "primary",
                onClick: () => openDialog(hasExistingPlan ? "edit" : "add"),
            },
        ]);
        return () => setActions([]);
    }, [actionsInView, hasExistingPlan, setActions]);

    const topBar = (
        <div className={styles.header}>
            <div className={styles.actions} ref={actionsRef}>
                <Button appearance="secondary" icon={<CalendarTodayRegular />} onClick={goToToday}>
                    Today
                </Button>
                <Button
                    appearance="primary"
                    icon={hasExistingPlan ? <EditRegular /> : <AddRegular />}
                    onClick={() => openDialog(hasExistingPlan ? "edit" : "add")}
                >
                    {hasExistingPlan ? "Edit plan" : "Add plan"}
                </Button>
            </div>
        </div>
    );

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
            {/* Desktop: two-column layout */}
            <div className={styles.desktopLayout}>
                <div className={styles.calendarSide}>
                    {topBar}
                    {monthNav}
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
                    />
                </div>
            </div>

            {/* Mobile: horizontal scroll layout */}
            <div className={styles.mobileLayout}>
                {topBar}
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
