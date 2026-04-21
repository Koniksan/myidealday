import { supabase } from "./supabase-client";

export interface StoredTask {
    id?: string;
    label: string;
    checked: boolean;
    position: number;
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
        .select("id, date, label, checked, position")
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
    labels: string[],
    positionOffset = 0,
): Promise<Record<string, StoredDay>> => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const taskRows = Array.from({ length: daysInMonth }, (_, i) => toDateString(year, month, i + 1)).flatMap(date =>
        labels.map((label, idx) => ({ date, label, checked: false, position: positionOffset + idx }))
    );

    const { data, error } = await supabase
        .from("tasks")
        .insert(taskRows)
        .select("id, date, label, checked, position");

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
        .select("id, label, checked, position")
        .single();

    if (error) throw error;
    return data;
};

export const updateTask = async (id: string, patch: Partial<Pick<StoredTask, "checked" | "label">>): Promise<void> => {
    const { error } = await supabase.from("tasks").update(patch).eq("id", id);
    if (error) throw error;
};

export const deleteTask = async (id: string): Promise<void> => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) throw error;
};

export const deleteTasksByLabelForMonth = async (year: number, month: number, label: string): Promise<void> => {
    const from = toDateString(year, month, 1);
    const to = toDateString(year, month, new Date(year, month + 1, 0).getDate());

    const { error } = await supabase
        .from("tasks")
        .delete()
        .gte("date", from)
        .lte("date", to)
        .eq("label", label);

    if (error) throw error;
};
