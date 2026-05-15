import { supabase } from "./supabase-client";
import { FeedbackStatus } from "./feedback-storage";
import { FeedbackType, User, UserRole } from "../models";

export interface AdminFeedback {
    id: string;
    userId: string;
    email: string | null;
    message: string;
    status: FeedbackStatus;
    answer: string | null;
    createdAt: string;
    type: FeedbackType | null;
}

export const getAllUsers = async (): Promise<User[]> => {
    const { data, error } = await supabase.rpc("get_all_users_for_admin");
    if (error) throw error;
    return (data ?? []).map((u: { id: string; email: string | null; full_name: string | null; avatar_url: string | null; created_at: string; last_sign_in_at: string | null, role: UserRole }) => ({
        id: u.id,
        email: u.email ?? null,
        fullName: u.full_name ?? null,
        avatarUrl: u.avatar_url ?? null,
        createdAt: u.created_at,
        lastSignInAt: u.last_sign_in_at ?? null,
        role: u.role ?? null,
    }));
};

export const updateFeedback = async (
    id: string,
    status: FeedbackStatus,
    answer: string | null,
    type: FeedbackType | null,
): Promise<void> => {
    const { error } = await supabase.rpc("update_feedback_for_admin", {
        p_id: id,
        p_status: status,
        p_answer: answer,
        p_type: type,
    });
    if (error) throw error;
};

export const getAllFeedbacks = async (): Promise<AdminFeedback[]> => {
    const { data, error } = await supabase.rpc("get_all_feedbacks_for_admin");
    if (error) throw error;
    return (data ?? []).map((f: { id: string; user_id: string; email: string | null; message: string; status: string; answer: string | null; created_at: string; type: FeedbackType | null }) => ({
        id: f.id,
        userId: f.user_id,
        email: f.email ?? null,
        message: f.message,
        status: f.status as FeedbackStatus,
        answer: f.answer ?? null,
        createdAt: f.created_at,
        type: (f.type as FeedbackType) ?? null,
    }));
};

export const getUnreadFeedbacksForAdmin = async (): Promise<{ id: string }[]> => {
    const { data, error } = await supabase.rpc("get_unread_feedbacks_for_admin");
    if (error) throw error;
    return (data ?? []).map((r: { id: string }) => ({ id: r.id }));
};

export const markAdminFeedbackSeen = async (id: string): Promise<void> => {
    const { error } = await supabase.rpc("mark_feedback_seen_by_admin", { p_id: id });
    if (error) throw error;
};
