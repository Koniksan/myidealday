import { supabase } from "./supabase-client";

const BUCKET = "avatars";

export interface UserProfile {
    fullName: string | null;
    avatarUrl: string | null;
}

export const getProfile = async (userId: string): Promise<UserProfile> => {
    const { data, error } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", userId)
        .single();

    // PGRST116 = row not found — first-time user has no profile row yet
    if (error && error.code !== "PGRST116") throw error;

    return {
        fullName: data?.full_name ?? null,
        avatarUrl: data?.avatar_url ?? null,
    };
};

export const upsertProfile = async (userId: string, update: Partial<UserProfile>): Promise<void> => {
    const row: Record<string, unknown> = { id: userId, updated_at: new Date().toISOString() };
    if (update.fullName !== undefined) row.full_name = update.fullName;
    if (update.avatarUrl !== undefined) row.avatar_url = update.avatarUrl;

    const { error } = await supabase.from("profiles").upsert(row);
    if (error) throw error;
};

export const uploadAvatar = async (file: File, userId: string): Promise<string> => {
    const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
    const path = `${userId}/${userId}.${ext}`;

    const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { upsert: true, contentType: file.type });

    if (error) throw error;

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);

    if (!data.publicUrl.includes("/object/public/")) {
        throw new Error(`Bucket "${BUCKET}" is not public or does not exist`);
    }

    return data.publicUrl;
};
