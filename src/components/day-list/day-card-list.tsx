import { Button, Title2 } from "@fluentui/react-components";
import { AddRegular, CalendarTodayRegular, EditRegular } from "@fluentui/react-icons";
import React, { useState } from "react";
import { DayCard, DayCardShimmer } from "../day";
import { useDayCardListStyles } from "./day-card-list-styles";
import { useDayCardList } from "./useDayCardList";
import { DayPlanDialog } from "../day-plan-dialog";

export const DayCardList: React.FC = () => {
    const styles = useDayCardListStyles();
    const { days, monthName, year, planLabels, loading, gridRef, addPlanToAllDays, editPlan } = useDayCardList();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");

    const openDialog = (mode: "add" | "edit") => {
        setDialogMode(mode);
        setDialogOpen(true);
    };

    const hasExistingPlan = planLabels.length > 0;
    return (
        <>
            <div className={styles.header}>
                <Title2 as="h1">{monthName} {year}</Title2>
                <div className={styles.actions}>
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

            {dialogOpen && (
                <DayPlanDialog
                    open={dialogOpen}
                    mode={dialogMode}
                    planLabels={planLabels}
                    onClose={() => setDialogOpen(false)}
                    addPlanToAllDays={addPlanToAllDays}
                    editPlan={editPlan}
                />
            )}
        </>
    );
};
