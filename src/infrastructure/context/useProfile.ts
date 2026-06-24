import { useEffect, useState } from "react";
import { getProfile, upsertProfile, uploadAvatar, UserProfile } from "../storages/profile-storage";

export interface ProfileUpdate {
    fullName?: string;
    avatarFile?: File | null;
    avatarUrl?: string | null;
    theme?: string | null;
    language?: string | null;
}

export const useProfile = (userId: string | null) => {
    const [profile, setProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        if (!userId) {
            setProfile(null);
            return;
        }
        getProfile(userId)
            .then(setProfile)
            .catch(() => setProfile(null));
    }, [userId]);

    const updateProfile = async ({ fullName, avatarFile, avatarUrl, theme, language }: ProfileUpdate): Promise<string | null> => {
        if (!userId) return "Not authenticated";
        try {
            let resolvedAvatarUrl = avatarUrl;
            if (avatarFile) {
                resolvedAvatarUrl = await uploadAvatar(avatarFile, userId);
            }

            await upsertProfile(userId, { fullName, avatarUrl: resolvedAvatarUrl, theme, language });
            setProfile(prev => ({
                fullName: fullName !== undefined ? (fullName || null) : (prev?.fullName ?? null),
                avatarUrl: resolvedAvatarUrl !== undefined ? resolvedAvatarUrl : (prev?.avatarUrl ?? null),
                isAdmin: prev?.isAdmin ?? false,
                theme: theme !== undefined ? theme : (prev?.theme ?? null),
                language: language !== undefined ? language : (prev?.language ?? null),
            }));
            return null;
        } catch (e) {
            return e instanceof Error ? e.message : "Failed to update profile";
        }
    };

    return { profile, updateProfile };
};
