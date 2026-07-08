import { z } from "zod/v3";

export const createModuleSchema = z.object({
    name: z.string().min(2, "Module name required").trim(),
    key: z.string().min(2, "Module key required").toLowerCase().trim(),
    isActive: z.boolean().optional(),
});

export const updateModuleSchema = z.object({
    name: z.string().min(2, "Module name required").trim().optional(),
    key: z.string().min(2, "Module key required").toLowerCase().trim().optional(),
    isActive: z.boolean().optional(),
});
