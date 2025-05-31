export interface ApiResponse<T = unknown> {
    code?: number;
    message: string;
    data?: T;
}

// Success Response Interface
export interface SuccessApiResponse<T = unknown> {
    status: number;
    message: string;
    data: T;
    error_dict?: never;
}

// Error Response Interface
export interface ErrorApiResponse {
    status: number;
    message: string;
    error_dict: any;
    data?: never;
}
