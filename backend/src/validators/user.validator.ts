import { z } from "zod/v3";

export const createUserSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),

    email: z.string().email("Invalid email format").toLowerCase(),

    password: z.string().min(6, "Password must be at least 6 characters"),

    role: z.string().length(24, "Invalid role id"),
});

export const updateUserSchema = z.object({
    name: z.string().min(3).optional(),

    role: z.string().length(24).optional(),
});

export const userIdSchema = z.object({
    id: z.string().length(24, "Invalid user id"),
});
