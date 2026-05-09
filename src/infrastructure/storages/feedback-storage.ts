import { supabase } from "./supabase-client";

export type FeedbackStatus = "New" | "In Progress" | "Completed";

export interface StoredFeedback {
    id: string;
    message: string;
    status: FeedbackStatus;
    answer?: string | null;
    created_at: string;
    is_seen: boolean;
}

export const getFeedbacks = async (userId: string): Promise<StoredFeedback[]> => {
    const { data, error } = await supabase
        .from("feedback")
        .select("id, message, status, answer, created_at, is_seen")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
};

export const getUnreadFeedbacks = async (userId: string): Promise<{ id: string }[]> => {
    const { data, error } = await supabase
        .from("feedback")
        .select("id")
        .eq("user_id", userId)
        .eq("is_seen", false);
    if (error) throw error;
    return data ?? [];
};

export const markFeedbackSeen = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from("feedback")
        .update({ is_seen: true })
        .eq("id", id);
    if (error) throw error;
};

export const createFeedback = async (userId: string, text: string, email: string): Promise<StoredFeedback> => {
    const { data, error } = await supabase
        .from("feedback")
        .insert({ user_id: userId, message: text, email })
        .select("id, message, status, created_at, is_seen")
        .single();
    if (error) throw error;
    return data;
};

export const deleteFeedback = async (id: string): Promise<void> => {
    const { error } = await supabase.from("feedback").delete().eq("id", id);
    if (error) throw error;
};
