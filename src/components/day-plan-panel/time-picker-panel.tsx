import { mergeClasses } from "@fluentui/react-components";
import { DeleteRegular } from "@fluentui/react-icons";
import React from "react";
import { PlanItem, Translations } from "../../infrastructure";
import { useDayPlanPanelStyles } from "./day-plan-panel-styles";
import { useTimePickerPanel } from "./use-time-picker-panel";

export const EXACT_PRESETS = ["07:00", "08:00", "09:00", "12:00", "18:00", "22:00"];
export const INTERVAL_PRESET_MINUTES = [30, 60, 90, 120, 180];

export const getDurationMinutes = (start: string, end: string): number | null => {
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    if (isNaN(sh) || isNaN(sm) || isNaN(eh) || isNaN(em)) return null;
    return (eh * 60 + em) - (sh * 60 + sm);
};

export const calcDurationStr = (start: string, end: string, rs: Translations): string | null => {
    const diff = getDurationMinutes(start, end);
    if (diff === null || diff <= 0) return null;
    const h = Math.floor(diff / 60);
    const m = diff % 60;
    if (h === 0) return `${m} ${rs.TimeDurationMin}`;
    if (m === 0) return `${h} ${rs.TimeDurationHour}`;
    return `${h} ${rs.TimeDurationHour} ${m} ${rs.TimeDurationMin}`;
};

export const formatTimeChip = (item: PlanItem): string => {
    if (item.time_mode === "exact" && item.time_exact) return item.time_exact;
    if (item.time_mode === "interval") {
        if (item.time_start && item.time_end) return `${item.time_start} – ${item.time_end}`;
        if (item.time_start) return item.time_start;
    }
    return "";
};

interface TimePickerPanelProps {
    item: PlanItem;
    onUpdate: (patch: Partial<PlanItem>) => void;
    panelStyles: ReturnType<typeof useDayPlanPanelStyles>;
    rs: Translations;
}

export const TimePickerPanel: React.FC<TimePickerPanelProps> = ({ item, onUpdate, panelStyles, rs }) => {
    const {
        tab,
        exactVal,
        startVal,
        endVal,
        currentDurationMins,
        durationStr,
        switchTab,
        selectExactPreset,
        applyIntervalPreset,
        handleExactChange,
        handleStartChange,
        handleEndChange,
        handleClear,
    } = useTimePickerPanel(item, onUpdate, rs);

    return (
        <>
            <div className={panelStyles.timeTabBar}>
                <button
                    className={mergeClasses(panelStyles.timeTab, tab === "exact" && panelStyles.timeTabActive)}
                    onClick={() => switchTab("exact")}
                >
                    {rs.TimeExact}
                </button>
                <button
                    className={mergeClasses(panelStyles.timeTab, tab === "interval" && panelStyles.timeTabActive)}
                    onClick={() => switchTab("interval")}
                >
                    {rs.TimeInterval}
                </button>
                <button className={panelStyles.timeClearBtn} onClick={handleClear}>
                    <DeleteRegular fontSize={12} />
                    {rs.TimeClear}
                </button>
            </div>

            <div className={panelStyles.timePresets}>
                {tab === "exact"
                    ? EXACT_PRESETS.map(x => (
                        <button
                            key={x}
                            className={mergeClasses(panelStyles.timePreset, exactVal === x && panelStyles.timePresetActive)}
                            onClick={() => selectExactPreset(x)}
                        >
                            {x}
                        </button>
                    ))
                    : INTERVAL_PRESET_MINUTES.map((x, i) => (
                        <button
                            key={x}
                            className={mergeClasses(panelStyles.timePreset, currentDurationMins === x && panelStyles.timePresetActive)}
                            onClick={() => applyIntervalPreset(x)}
                        >
                            {rs.TimePresetsInterval[i]}
                        </button>
                    ))
                }
            </div>

            {tab === "exact" ? (
                <div className={panelStyles.timeInputRow}>
                    <input
                        type="time"
                        className={panelStyles.timeInput}
                        value={exactVal}
                        onChange={e => handleExactChange(e.target.value)}
                    />
                </div>
            ) : (
                <div className={panelStyles.timeInputRow}>
                    <input
                        type="time"
                        className={panelStyles.timeInput}
                        value={startVal}
                        placeholder={rs.TimeStartPlaceholder}
                        onChange={e => handleStartChange(e.target.value)}
                    />
                    <span className={panelStyles.timeArrow}>→</span>
                    <input
                        type="time"
                        className={panelStyles.timeInput}
                        value={endVal}
                        placeholder={rs.TimeEndPlaceholder}
                        onChange={e => handleEndChange(e.target.value)}
                    />
                    {durationStr && (
                        <span className={panelStyles.timeDurationBadge}>{durationStr}</span>
                    )}
                </div>
            )}
        </>
    );
};
