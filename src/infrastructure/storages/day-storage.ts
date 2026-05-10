import { supabase } from "./supabase-client";

export const TASK_COLORS = ["#e53935", "#f6bf26", "#039be5", "#33b679", "#8b5cf6"];

export interface PlanItem {
    label: string;
    color?: string | null;
}

export interface StoredTask {
    id?: string;
    label: string;
    checked: boolean;
    position: number;
    is_custom?: boolean;
    color?: string | null;
}

export interface StoredDay {
    date: string;
    tasks: StoredTask[];
}

const toDateString = (year: number, month: number, day: number): string =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

export const loadTasksForMonth = async (year: number, month: number): Promise<Record<string, StoredDay>> => {
    const from = toDateString(year, month, 1);
    const to = toDateString(year, month, new Date(year, month + 1, 0).getDate());

    const { data, error } = await supabase
        .from("tasks")
        .select("id, date, label, checked, position, is_custom, color")
        .gte("date", from)
        .lte("date", to)
        .order("position");

    if (error) throw error;

    return (data ?? []).reduce<Record<string, StoredDay>>((acc, { date, ...task }) => {
        if (!acc[date]) acc[date] = { date, tasks: [] };
        acc[date].tasks.push(task as StoredTask);
        return acc;
    }, {});
};

export const bulkSaveTasksForMonth = async (
    year: number,
    month: number,
    items: PlanItem[],
    positionOffset = 0,
    fromDay = 1,
): Promise<Record<string, StoredDay>> => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const taskRows = Array.from({ length: daysInMonth }, (_, i) => i + 1)
        .filter(d => d >= fromDay)
        .map(d => toDateString(year, month, d))
        .flatMap(date => items.map((item, idx) => ({
            date,
            label: item.label,
            color: item.color ?? null,
            checked: false,
            position: positionOffset + idx,
        })));

    const { data, error } = await supabase
        .from("tasks")
        .insert(taskRows)
        .select("id, date, label, checked, position, color");

    if (error) throw error;

    return (data ?? []).reduce<Record<string, StoredDay>>((acc, { date, ...task }) => {
        if (!acc[date]) acc[date] = { date, tasks: [] };
        acc[date].tasks.push(task as StoredTask);
        return acc;
    }, {});
};

export const saveTask = async (
    year: number,
    month: number,
    day: number,
    task: Omit<StoredTask, "id">,
): Promise<StoredTask> => {
    const date = toDateString(year, month, day);

    const { data, error } = await supabase
        .from("tasks")
        .insert({ date, ...task })
        .select("id, label, checked, position, is_custom, color")
        .single();

    if (error) throw error;
    return data;
};

export const updateTask = async (id: string, patch: Partial<Pick<StoredTask, "checked" | "label" | "color">>): Promise<void> => {
    const { error } = await supabase.from("tasks").update(patch).eq("id", id);
    if (error) throw error;
};

export const updateTaskColorByLabel = async (
    year: number,
    month: number,
    label: string,
    color: string | null,
    fromDay = 1,
): Promise<void> => {
    const from = toDateString(year, month, fromDay);
    const to = toDateString(year, month, new Date(year, month + 1, 0).getDate());
    const { error } = await supabase
        .from("tasks")
        .update({ color })
        .eq("label", label)
        .gte("date", from)
        .lte("date", to);
    if (error) throw error;
};

export const deleteTask = async (id: string): Promise<void> => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) throw error;
};

export const reorderTasksByLabelsForMonth = async (
    year: number,
    month: number,
    orderedLabels: string[],
    fromDay = 1,
): Promise<void> => {
    const from = toDateString(year, month, fromDay);
    const to = toDateString(year, month, new Date(year, month + 1, 0).getDate());

    await Promise.all(
        orderedLabels.map((label, position) =>
            supabase.from("tasks").update({ position }).eq("label", label).gte("date", from).lte("date", to)
        )
    );
};

export const deleteTasksByLabelForMonth = async (year: number, month: number, label: string, fromDay = 1): Promise<void> => {
    const from = toDateString(year, month, fromDay);
    const to = toDateString(year, month, new Date(year, month + 1, 0).getDate());

    const { error } = await supabase
        .from("tasks")
        .delete()
        .gte("date", from)
        .lte("date", to)
        .eq("label", label);

    if (error) throw error;
};

export const deleteAllTasksFromDate = async (fromDate: string): Promise<void> => {
    const { error } = await supabase
        .from("tasks")
        .delete()
        .gte("date", fromDate);

    if (error) throw error;
};
