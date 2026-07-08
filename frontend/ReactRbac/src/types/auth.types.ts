export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    role: string;
}

export interface RegisterResponse {
    success: boolean;
    message: string;
}
export interface VerifyOpt {
    email: string;
    otp: string;
}