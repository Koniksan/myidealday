import { ArrowLeftRegular } from "@fluentui/react-icons";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useLocalization } from "../../../infrastructure/context/locale-context";
import { usePageShellStyles } from "./page-shell-styles";

interface PageShellProps {
    children: React.ReactNode;
    backTo?: string;
    onBack?: () => void;
}

export const PageShell: React.FC<PageShellProps> = ({ children, backTo, onBack }) => {
    const styles = usePageShellStyles();
    const navigate = useNavigate();
    const rs = useLocalization();

    const handleBack = onBack ?? (backTo ? () => navigate(backTo) : undefined);

    return (
        <div className={styles.root}>
            {handleBack && (
                <button className={styles.backButton} onClick={handleBack}>
                    <ArrowLeftRegular />
                    {rs.Back}
                </button>
            )}
            {children}
        </div>
    );
};
