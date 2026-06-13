import { useEffect, useState } from "react";
import { PlanItem, Translations } from "../../infrastructure";
import { calcDurationStr, getDurationMinutes } from "./time-picker-panel";

export const useTimePickerPanel = (item: PlanItem, onUpdate: (patch: Partial<PlanItem>) => void, rs: Translations) => {
    const [tab, setTab] = useState<"exact" | "interval">(
        item.time_mode === "interval" ? "interval" : "exact"
    );
    const [exactVal, setExactVal] = useState(item.time_exact ?? "");
    const [startVal, setStartVal] = useState(item.time_start ?? "");
    const [endVal, setEndVal] = useState(item.time_end ?? "");

    useEffect(() => {
        setExactVal(item.time_exact ?? "");
        setStartVal(item.time_start ?? "");
        setEndVal(item.time_end ?? "");
        setTab(item.time_mode === "interval" ? "interval" : "exact");
    }, [item.time_exact, item.time_start, item.time_end, item.time_mode]);

    const makeTimeHandler =
        (setter: (v: string) => void, getPatch: (val: string) => Partial<PlanItem>) =>
        (val: string) => { setter(val); onUpdate(getPatch(val)); };

    const handleExactChange = makeTimeHandler(setExactVal, x => ({
        time_mode: "exact", time_exact: x || null,
    }));

    const handleStartChange = makeTimeHandler(setStartVal, x => ({
        time_mode: "interval", time_start: x || null, time_end: endVal || null,
    }));

    const handleEndChange = makeTimeHandler(setEndVal, x => ({
        time_mode: "interval", time_start: startVal || null, time_end: x || null,
    }));

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

    const handleClear = () => {
        setTab("exact");
        setExactVal("");
        setStartVal("");
        setEndVal("");
        onUpdate({ time_mode: null, time_exact: null, time_start: null, time_end: null });
    };

    const currentDurationMins = startVal && endVal ? getDurationMinutes(startVal, endVal) : null;
    const durationStr = startVal && endVal ? calcDurationStr(startVal, endVal, rs) : null;

    return {
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
    };
};
