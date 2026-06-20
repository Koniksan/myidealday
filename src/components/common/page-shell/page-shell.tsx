import React from "react";
import { usePageShellStyles } from "./page-shell-styles";

interface PageShellProps {
    children: React.ReactNode;
}

export const PageShell: React.FC<PageShellProps> = ({ children }) => {
    const styles = usePageShellStyles();

    return (
        <div className={styles.root}>
            {children}
        </div>
    );
};
