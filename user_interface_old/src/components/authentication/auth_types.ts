// src/types/auth.types.ts
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials extends LoginCredentials {
    username?: string;
    confirm_password: string;
}

export interface AuthResponse {
    token: string;
    user: {
        id: number;
        email: string;
        username?: string;
    };
}