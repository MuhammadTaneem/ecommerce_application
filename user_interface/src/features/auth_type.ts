export interface UserType {
    id: number;
    is_superuser: boolean;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null; // Phone can be null
    is_active: boolean;
    is_staff: boolean;
    is_verified: boolean;
    created_at: string; // You might want to use Date type if you parse it
    updated_at: string; // Same as above
    last_login: string | null; // Last login can be null
    avatar: string | null; // Avatar can be null
    permissions: string[]; // Array of strings
    role: number; // Assuming role is a number
    groups: any[]; // Assuming groups is an array, you can specify a more detailed type if needed
    user_permissions: any[]; // Same as above, specify a more detailed type if needed
}