import { z } from "zod/v3";

export const createPermissionSchema = z.object({
    permissions: z.object({
        read: z.boolean().optional(),
        write: z.boolean().optional(),
    }).optional(),
    moduleId: z.string().min(24, "Invalid module ID").max(24, "Invalid module ID"),
    roleId: z.string().min(24, "Invalid role ID").max(24, "Invalid role ID"),
});

export const updatePermissionSchema = z.object({
    permissions: z.object({
        read: z.boolean().optional(),
        write: z.boolean().optional(),
    }).optional(),
    moduleId: z.string().min(24, "Invalid module ID").max(24, "Invalid module ID").optional(),
    roleId: z.string().min(24, "Invalid role ID").max(24, "Invalid role ID").optional(),
});
