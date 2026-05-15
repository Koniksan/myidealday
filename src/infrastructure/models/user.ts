export interface User {
    id: string;
    email: string | null;
    fullName: string | null;
    avatarUrl: string | null;
    createdAt: string;
    lastSignInAt: string | null;
    role: UserRole;
    isAdmin: boolean;
}

export enum UserRole {
    User = 1,
    Admin = 2,
}