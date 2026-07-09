import { z } from "zod/v3";

export const registerSchema = z.object({
    name: z
        .string({
            required_error: "Name is required",
        })
        .min(3, {
            message: "Name must be at least 3 characters",
        }),

    email: z
        .string()
        .min(1, { message: "Email is required" })
        .pipe(z.string().email({ message: "Invalid email format" }).toLowerCase()),

    password: z
        .string({
            required_error: "Password is required",
        })
        .pipe(
            z.string().min(6, {
                message: "Password must be at least 6 characters",
            }),
        ),
});

export const loginSchema = z.object({

    email: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email format")
        .toLowerCase(),


    password: z
        .string()
        .min(1, "Password is required")

});

export const verifyOtpSchema = z.object({

    email: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email format")
        .toLowerCase(),


    otp: z
        .string()
        .length(6, "OTP must be 6 digits")

});

export const forgotPasswordSchema = z.object({

    email: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email format")
        .toLowerCase()

});


export const resetPasswordSchema = z.object({

    email: z
        .string()
        .email("Invalid email format")
        .toLowerCase(),


    otp: z
        .string()
        .length(6, "OTP must be 6 digits"),


    newPassword: z
        .string()
        .min(6, "Password must be at least 6 characters")

});



export const refreshTokenSchema = z.object({

    refreshToken: z
        .string()
});

export const resendOtpSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email format")
        .toLowerCase(),
});

