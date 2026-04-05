import { Title2 } from "@fluentui/react-components";
import React from "react";
import { Day } from "../day";
import { useDayListStyles } from "./day-list-styles";
import { useDayList } from "./useDayList";

export const DayList: React.FC = () => {
    const styles = useDayListStyles();
    const { days, monthName, year } = useDayList();

    return (
        <>
            <Title2 as="h1" block className={styles.heading}>{monthName} {year}</Title2>
            <div className={styles.grid}>
            {days.map(({ day, shortName, isToday, isWeekend }) => (
                <Day key={day} day={day} shortName={shortName} isToday={isToday} isWeekend={isWeekend} />
            ))}
            </div>
        </>
    );
};
