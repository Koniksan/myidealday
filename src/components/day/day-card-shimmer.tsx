import { Skeleton, SkeletonItem, makeStyles, tokens } from "@fluentui/react-components";
import React from "react";
import { breakpoints } from "../common/styles/breakpoints";

const useStyles = makeStyles({
    card: {
        width: "100%",
        minHeight: "110px",
        borderRadius: "10px",
        border: `1px solid ${tokens.colorNeutralStroke2}`,
        [breakpoints.mobile]: {
            width: "82vw",
            flexShrink: 0,
            minHeight: "340px",
        },
    },
});

export const DayCardShimmer: React.FC = () => {
    const styles = useStyles();
    return (
        <Skeleton>
            <SkeletonItem className={styles.card} />
        </Skeleton>
    );
};
