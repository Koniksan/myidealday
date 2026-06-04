import { supabase } from "./supabase-client";

export const TASK_COLORS = ["#e53935", "#f6bf26", "#039be5", "#33b679", "#8b5cf6"];

export interface PlanItem {
    label: string;
    color?: string | null;
    time_mode?: "exact" | "interval" | null;
    time_exact?: string | null;
    time_start?: string | null;
    time_end?: string | null;
}

export interface StoredTask {
    label: string;
    checked: boolean;
    position: number;
    is_custom?: boolean;
    id?: string;
    color?: string | null;
    time_mode?: "exact" | "interval" | null;
    time_exact?: string | null;
    time_start?: string | null;
    time_end?: string | null;
}

export interface StoredDay {
    date: string;
    tasks: StoredTask[];
}

export const loadPlan = async (): Promise<PlanItem[]> => {
    const { data, error } = await supabase.from("plan").select("tasks").single();
    if (error) {
        if (error.code === "PGRST116") return [];
        throw error;
    }
    return (data?.tasks ?? []) as PlanItem[];
};

export const savePlan = async (tasks: PlanItem[]): Promise<void> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Not authenticated");
    const { error } = await supabase
        .from("plan")
        .upsert({ user_id: session.user.id, tasks }, { onConflict: "user_id" });
    if (error) throw error;
};

export const loadAllDays = async (): Promise<Record<string, StoredDay>> => {
    const { data, error } = await supabase.from("days").select("date, tasks").order("date");
    if (error) throw error;
    return (data ?? []).reduce<Record<string, StoredDay>>((acc, x) => {
        acc[x.date] = { date: x.date, tasks: x.tasks as StoredTask[] };
        return acc;
    }, {});
};

export const saveDay = async (date: string, tasks: StoredTask[]): Promise<void> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Not authenticated");
    const { error } = await supabase
        .from("days")
        .upsert({ user_id: session.user.id, date, tasks }, { onConflict: "user_id,date" });
    if (error) throw error;
};

export const deleteDaysFromDate = async (fromDate: string): Promise<void> => {
    const { error } = await supabase.from("days").delete().gte("date", fromDate);
    if (error) throw error;
};
