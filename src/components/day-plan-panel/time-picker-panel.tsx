import { mergeClasses } from "@fluentui/react-components";
import { DeleteRegular } from "@fluentui/react-icons";
import React, { useState } from "react";
import { Translations } from "../../infrastructure/context/translations";
import { PlanItem } from "../../infrastructure/storages/day-storage";
import { useDayPlanPanelStyles } from "./day-plan-panel-styles";

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
    const [tab, setTab] = useState<"exact" | "interval">(
        item.time_mode === "interval" ? "interval" : "exact"
    );
    const [exactVal, setExactVal] = useState(item.time_exact ?? "");
    const [startVal, setStartVal] = useState(item.time_start ?? "");
    const [endVal, setEndVal] = useState(item.time_end ?? "");

    const switchTab = (t: "exact" | "interval") => {
        setTab(t);
        onUpdate({ time_mode: t });
    };

    const selectExactPreset = (preset: string) => {
        setExactVal(preset);
        onUpdate({ time_mode: "exact", time_exact: preset });
    };

    const applyIntervalPreset = (minutes: number) => {
        const s = startVal || "07:00";
        const [h, m] = s.split(":").map(Number);
        const endMins = h * 60 + m + minutes;
        const eh = Math.floor(endMins / 60) % 24;
        const em = endMins % 60;
        const end = `${String(eh).padStart(2, "0")}:${String(em).padStart(2, "0")}`;
        if (!startVal) setStartVal(s);
        setEndVal(end);
        onUpdate({ time_mode: "interval", time_start: s, time_end: end });
    };

    const handleExactChange = (val: string) => {
        setExactVal(val);
        onUpdate({ time_mode: "exact", time_exact: val || null });
    };

    const handleStartChange = (val: string) => {
        setStartVal(val);
        onUpdate({ time_mode: "interval", time_start: val || null, time_end: endVal || null });
    };

    const handleEndChange = (val: string) => {
        setEndVal(val);
        onUpdate({ time_mode: "interval", time_start: startVal || null, time_end: val || null });
    };

    const handleClear = () => {
        setTab("exact");
        setExactVal("");
        setStartVal("");
        setEndVal("");
        onUpdate({ time_mode: null, time_exact: null, time_start: null, time_end: null });
    };

    const currentDurationMins = startVal && endVal ? getDurationMinutes(startVal, endVal) : null;
    const durationStr = startVal && endVal ? calcDurationStr(startVal, endVal, rs) : null;

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
