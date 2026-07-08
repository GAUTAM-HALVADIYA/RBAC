import { z } from "zod/v3";

export const updateProfileSchema = z.object({
    phone: z.string().min(10, "Invalid phone number").optional(),

    address: z.string().min(3).optional(),

    avatar: z.string().optional(),
});
