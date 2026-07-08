import { Router } from "express";
import { PermissionController } from "../controllers/permission.controller";
import { authenticate, dynamicAuthorize } from "../middleware/auth";
import { MODULES } from "../constants/modules.constants";
import { validator } from "../middleware/validator.middleware";
import { createPermissionSchema, updatePermissionSchema } from "../validators/permission.validator";

const router = Router();
const permissionController = new PermissionController();

router.use(authenticate);

router.post("/", dynamicAuthorize(MODULES.PERMISSIONS, "write"), validator(createPermissionSchema), permissionController.createPermission);
router.get("/", dynamicAuthorize(MODULES.PERMISSIONS, "read"), permissionController.getPermissions);
router.get("/:id", dynamicAuthorize(MODULES.PERMISSIONS, "read"), permissionController.getPermissionById);
router.patch("/:id", dynamicAuthorize(MODULES.PERMISSIONS, "write"), validator(updatePermissionSchema), permissionController.updatePermission);
router.delete("/:id", dynamicAuthorize(MODULES.PERMISSIONS, "write"), permissionController.deletePermission);

export default router;
