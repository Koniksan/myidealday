import { makeStyles } from "@fluentui/react-components";

export const useDayCardListStyles = makeStyles({
    header: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "24px",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: "12px",
    },
    dialogInputRow: {
        display: "flex",
        gap: "8px",
        alignItems: "center",
        marginBottom: "12px",
    },
    dialogInput: {
        flex: 1,
    },
    tagGroup: {
        flexWrap: "wrap",
        gap: "6px",
    },
});
