import { Button, Title2 } from "@fluentui/react-components";
import { AddRegular, CalendarTodayRegular, EditRegular } from "@fluentui/react-icons";
import React, { useEffect, useRef, useState } from "react";
import { DayCard, DayCardShimmer } from "../day";
import { useDayCardListStyles } from "./day-card-list-styles";
import { useDayCardList } from "./useDayCardList";
import { DayPlanDialog } from "../day-plan-dialog";
import { useHeaderActions } from "../../infrastructure/context/header-actions-context";

export const DayCardList: React.FC = () => {
    const styles = useDayCardListStyles();
    const { days, monthName, year, planLabels, loading, gridRef, addPlanToAllDays, editPlan, resetPlan } = useDayCardList();

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
                onClick: () => document.querySelector("[data-today]")?.scrollIntoView({ behavior: "smooth", block: "center" }),
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

    return (
        <>
            <div className={styles.header}>
                <Title2 as="h1">{monthName} {year}</Title2>
                <div className={styles.actions} ref={actionsRef}>
                        <Button
                            appearance="secondary"
                            icon={<CalendarTodayRegular />}
                            onClick={() => document.querySelector("[data-today]")?.scrollIntoView({ behavior: "smooth", block: "center" })}
                        >
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

            <div className={styles.grid} ref={gridRef}>
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

            <DayPlanDialog
                open={dialogOpen}
                mode={dialogMode}
                planLabels={planLabels}
                onClose={() => setDialogOpen(false)}
                addPlanToAllDays={addPlanToAllDays}
                editPlan={editPlan}
                resetPlan={resetPlan}
            />
        </>
    );
};
