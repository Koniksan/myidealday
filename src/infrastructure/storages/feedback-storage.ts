import { supabase } from "./supabase-client";

export type FeedbackStatus = "New" | "In Progress" | "Completed";

export interface StoredFeedback {
    id: string;
    message: string;
    status: FeedbackStatus;
    answer?: string | null;
    created_at: string;
}

export const getFeedbacks = async (userId: string): Promise<StoredFeedback[]> => {
    const { data, error } = await supabase
        .from("feedback")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
};

export const createFeedback = async (userId: string, text: string, email: string): Promise<StoredFeedback> => {
    const { data, error } = await supabase
        .from("feedback")
        .insert({ user_id: userId, message: text, email })
        .select("id, message, status, created_at")
        .single();
    if (error) throw error;
    return data;
};

export const deleteFeedback = async (id: string): Promise<void> => {
    const { error } = await supabase.from("feedback").delete().eq("id", id);
    if (error) throw error;
};
