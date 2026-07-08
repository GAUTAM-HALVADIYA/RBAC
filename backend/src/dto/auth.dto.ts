export type RegisterDto = {
    name: string;
    email: string;
    password: string;
    role: string;
};

export type LoginDto = {
    email: string;
    password: string;
};

export type VerifyOtpDto = {
    email: string;
    otp: string;
};

export type ForgotPasswordDto = {
    email: string;
};

export type ResetPasswordDto = {
    email: string;
    otp: string;
    newPassword: string;
};

export type RefreshTokenDto = {
    refreshToken: string;
};