import { supabase } from "./supabase-client";

export interface StoredTask {
    id?: string;
    label: string;
    checked: boolean;
    position: number;
}

export interface StoredDay {
    id?: string;
    date: string;
    tasks: StoredTask[];
}

const toDateString = (year: number, month: number, day: number): string =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

export const loadTasksForMonth = async (year: number, month: number): Promise<Record<string, StoredDay>> => {
    const from = toDateString(year, month, 1);
    const to = toDateString(year, month, new Date(year, month + 1, 0).getDate());

    const { data, error } = await supabase
        .from("days")
        .select("id, date, tasks(id, label, checked, position)")
        .gte("date", from)
        .lte("date", to);

    if (error) throw error;

    return (data ?? []).reduce<Record<string, StoredDay>>((acc, { id, date, tasks }) => {
        acc[date] = { id, date, tasks: (tasks as StoredTask[]).sort((a, b) => a.position - b.position) };
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
    const dates = Array.from({ length: daysInMonth }, (_, i) => toDateString(year, month, i + 1));

    const { data: dayRows, error: dayError } = await supabase
        .from("days")
        .upsert(dates.map(date => ({ date })), { onConflict: "date" })
        .select("id, date");

    if (dayError) throw dayError;

    const taskRows = (dayRows ?? []).flatMap(({ id: day_id }) =>
        labels.map((label, idx) => ({ day_id, label, checked: false, position: positionOffset + idx }))
    );

    const { data: taskData, error: taskError } = await supabase
        .from("tasks")
        .insert(taskRows)
        .select("id, label, checked, position, day_id");

    if (taskError) throw taskError;

    const dayIdToRow = Object.fromEntries((dayRows ?? []).map(row => [row.id, row]));
    return (taskData ?? []).reduce<Record<string, StoredDay>>((acc, { day_id, ...task }) => {
        const { id, date } = dayIdToRow[day_id];
        if (!acc[date]) acc[date] = { id, date, tasks: [] };
        acc[date].tasks.push(task);
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

    const { data: dayRow, error: dayError } = await supabase
        .from("days")
        .upsert({ date }, { onConflict: "date" })
        .select("id")
        .single();

    if (dayError) throw dayError;

    const { data, error } = await supabase
        .from("tasks")
        .insert({ day_id: dayRow.id, ...task })
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

    const { data: dayRows, error: dayError } = await supabase
        .from("days")
        .select("id")
        .gte("date", from)
        .lte("date", to);

    if (dayError) throw dayError;

    const dayIds = (dayRows ?? []).map(d => d.id);
    if (dayIds.length === 0) return;

    const { error } = await supabase.from("tasks").delete().in("day_id", dayIds).eq("label", label);
    if (error) throw error;
};
