import { makeStyles } from "@fluentui/react-components";

export const useDayListStyles = makeStyles({
    heading: {
        marginBottom: "24px",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: "10px",
    },
});
