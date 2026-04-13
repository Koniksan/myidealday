import { supabase } from "./supabase-client";

export interface StoredTask {
    id?: string;
    label: string;
    checked: boolean;
    position: number;
}

const toDateString = (year: number, month: number, day: number): string =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

export const loadTasks = async (year: number, month: number, day: number): Promise<StoredTask[]> => {
    const { data, error } = await supabase
        .from("tasks")
        .select("id, label, checked, position")
        .eq("date", toDateString(year, month, day))
        .order("position", { ascending: true });

    if (error) throw error;
    return data ?? [];
};

export const saveTask = async (
    year: number,
    month: number,
    day: number,
    task: Omit<StoredTask, "id">,
): Promise<StoredTask> => {
    const { data, error } = await supabase
        .from("tasks")
        .insert({ date: toDateString(year, month, day), ...task })
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
