import { Badge, mergeClasses } from "@fluentui/react-components";
import { CalendarArrowRepeatAllRegular, HomeRegular, PersonRegular } from "@fluentui/react-icons";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../infrastructure/context/auth-context";
import { useLocalization } from "../../../infrastructure/context/locale-context";
import { useNotificationBadge } from "../../../infrastructure/context/notification-badge-context";
import { DayPlanPanel } from "../../day-plan-panel";
import { useBottomNavStyles } from "./bottom-nav-styles";
import { useBottomNav } from "./use-bottom-nav";

export const BottomNav: React.FC = () => {
    const { isLoggedIn } = useAuth();
    const { totalCount } = useNotificationBadge();
    const rs = useLocalization();
    const styles = useBottomNavStyles();
    const navigate = useNavigate();
    const location = useLocation();
    const { panelOpen, planLabels, mode, openPanel, closePanel, addPlanToAllDays, editPlan, resetPlan } = useBottomNav();

    const isHome = location.pathname === "/home";
    const isAccount = location.pathname.startsWith("/account") || location.pathname === "/settings";

    if (!isLoggedIn) return null;

    return (
        <>
            <nav className={styles.root}>
                <button
                    className={mergeClasses(styles.navButton, isHome && styles.navButtonActive)}
                    onClick={() => navigate("/home")}
                >
                    <HomeRegular fontSize={22} />
                    <span className={styles.navLabel}>{rs.Home}</span>
                </button>

                <button
                    className={mergeClasses(styles.navButton, panelOpen && styles.navButtonActive)}
                    onClick={openPanel}
                >
                    <CalendarArrowRepeatAllRegular fontSize={22} />
                    <span className={styles.navLabel}>{rs.MyHabbits}</span>
                </button>

                <button
                    className={mergeClasses(styles.navButton, isAccount && styles.navButtonActive)}
                    onClick={() => navigate("/account")}
                >
                    <div className={styles.iconWrapper}>
                        <PersonRegular fontSize={22} />
                        {totalCount > 0 && (
                            <Badge className={styles.badge} color="danger" size="small" appearance="filled">
                                {totalCount}
                            </Badge>
                        )}
                    </div>
                    <span className={styles.navLabel}>{rs.Account}</span>
                </button>
            </nav>

            <DayPlanPanel
                open={panelOpen}
                mode={mode}
                planLabels={planLabels}
                onClose={closePanel}
                addPlanToAllDays={addPlanToAllDays}
                editPlan={editPlan}
                resetPlan={resetPlan}
            />
        </>
    );
};
