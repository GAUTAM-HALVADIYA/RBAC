import { z } from "zod/v3";

export const createRoleSchema = z.object({
    name: z.string().min(2, "Role name required").toLowerCase().trim(),
});

export const updateRoleSchema = z.object({
    name: z.string().min(2, "Role name required").toLowerCase().trim(),
});
