export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface RegisterResponse {
    success: boolean;
    message: string;
}
export interface VerifyOtpRequest {
    email: string;
    otp: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    email: string;
    otp: string;
    newPassword: string;
}

export interface ResendOtpRequest {
    email: string;
}

export interface User {
    _id: string;
    name: string;
    email: string;
    role: {
        _id: string;
        name: string;
    };
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        accessToken: string;
        refreshToken: string;
    };
}

export interface MeResponse {
    success: boolean;
    data: User;
}

export interface AuthContextType {
    user: User | null;
    accessToken: string | null;
    loading: boolean;

    login: (accessToken: string, refreshToken: string) => Promise<void>;
    logout: () => void;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}