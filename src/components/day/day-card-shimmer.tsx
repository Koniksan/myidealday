import { Skeleton, SkeletonItem } from "@fluentui/react-components";
import { makeStyles, tokens } from "@fluentui/react-components";
import React from "react";
import { breakpoints } from "../../styles/breakpoints";

const useStyles = makeStyles({
    card: {
        width: "100%",
        minHeight: "240px",
        borderRadius: "10px",
        background: tokens.colorNeutralBackground2,
        border: `1px solid ${tokens.colorNeutralStroke2}`,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        [breakpoints.mobile]: {
            width: "82vw",
            flexShrink: 0,
            minHeight: "340px",
        },
    },
    progressBar: {
        width: "100%",
        height: "5px",
        flexShrink: 0,
    },
    header: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "6px",
        padding: "14px 8px 12px",
    },
    body: {
        display: "flex",
        flexDirection: "column",
        flex: 1,
        padding: "0 10px 8px",
        gap: "12px",
    },
    taskRow: {
        width: "100%",
        borderRadius: "4px",
    },
});

export const DayCardShimmer: React.FC = () => {
    const styles = useStyles();
    return (
        <div className={styles.card}>
            <Skeleton>
                <SkeletonItem className={styles.progressBar} />
                <div className={styles.header}>
                    <SkeletonItem size={12} style={{ width: "40px", borderRadius: "4px" }} />
                    <SkeletonItem size={28} style={{ width: "32px", borderRadius: "4px" }} />
                </div>
                <div className={styles.body}>
                    {Array.from({ length: 4 }, (_, i) => (
                        <SkeletonItem key={i} size={16} className={styles.taskRow} />
                    ))}
                </div>
            </Skeleton>
        </div>
    );
};
