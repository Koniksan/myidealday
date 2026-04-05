import { Title2 } from "@fluentui/react-components";
import React from "react";
import { DayCard } from "../day";
import { useDayCardListStyles } from "./day-card-list-styles";
import { useDayCardList } from "./useDayCardList";

export const DayCardList: React.FC = () => {
    const styles = useDayCardListStyles();
    const { days, monthName, year } = useDayCardList();

    return (
        <>
            <Title2 as="h1" block className={styles.heading}>{monthName} {year}</Title2>
            <div className={styles.grid}>
                {days.map(({ day, shortName, isToday, isWeekend }) => (
                    <DayCard key={day} day={day} shortName={shortName} isToday={isToday} isWeekend={isWeekend} />
                ))}
            </div>
        </>
    );
};
