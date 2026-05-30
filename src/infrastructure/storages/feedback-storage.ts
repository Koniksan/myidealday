import { supabase } from "./supabase-client";

export type FeedbackStatus = "New" | "In Progress" | "Completed";

export interface StoredFeedback {
    id: string;
    message: string;
    status: FeedbackStatus;
    answer?: string | null;
    created_at: string;
    is_seen: boolean;
    image_url?: string | null;
}

const FEEDBACK_BUCKET = "feedback-images";
const DEFAULT_MAX_IMAGE_SIZE = 1200;
const IMAGE_QUALITY = 0.8;

export const compressImage = (file: File, maxSize: number = DEFAULT_MAX_IMAGE_SIZE): Promise<Blob> =>
    new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
            URL.revokeObjectURL(url);
            const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
            const canvas = document.createElement("canvas");
            canvas.width = Math.round(img.width * scale);
            canvas.height = Math.round(img.height * scale);
            canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(b => b ? resolve(b) : reject(new Error("Compression failed")), "image/jpeg", IMAGE_QUALITY);
        };
        img.onerror = reject;
        img.src = url;
    });

export const uploadFeedbackImage = async (blob: Blob, userId: string): Promise<string> => {
    const path = `${userId}/${Date.now()}.jpg`;
    const { error } = await supabase.storage
        .from(FEEDBACK_BUCKET)
        .upload(path, blob, { contentType: "image/jpeg" });
    if (error) throw error;
    const { data } = supabase.storage.from(FEEDBACK_BUCKET).getPublicUrl(path);
    return data.publicUrl;
};

export const getFeedbacks = async (userId: string): Promise<StoredFeedback[]> => {
    const { data, error } = await supabase
        .from("feedback")
        .select("id, message, status, answer, created_at, is_seen, image_url")
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

export const createFeedback = async (userId: string, text: string, email: string, imageUrl?: string): Promise<StoredFeedback> => {
    const { data, error } = await supabase
        .from("feedback")
        .insert({ user_id: userId, message: text, email, image_url: imageUrl ?? null })
        .select("id, message, status, created_at, is_seen, image_url")
        .single();
    if (error) throw error;
    return data;
};

export const deleteFeedback = async (id: string): Promise<void> => {
    const { error } = await supabase.from("feedback").delete().eq("id", id);
    if (error) throw error;
};
