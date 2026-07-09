export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface RegisterResponse {
    success: boolean;
    message: string;
}
export interface VerifyOpt {
    email: string;
    otp: string;
}
export interface LoginRequest {
    email: string;
    password: string;
}