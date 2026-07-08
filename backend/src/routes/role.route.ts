import { Router } from "express";
import { authenticate, dynamicAuthorize } from "../middleware/auth";
import { RoleController } from "../controllers/role.controller";
import { validator } from "../middleware/validator.middleware";
import { MODULES } from "../constants/modules.constants";
import {
    createRoleSchema,
    updateRoleSchema,
} from "../validators/role.validator";

const roleRouter = Router();
let role = new RoleController();

roleRouter.use(authenticate);

roleRouter.post("/", dynamicAuthorize(MODULES.ROLES, "write"), validator(createRoleSchema), role.createRole);
roleRouter.get("/", dynamicAuthorize(MODULES.ROLES, "read"), role.getRoles);
roleRouter.get("/:id", dynamicAuthorize(MODULES.ROLES, "read"), role.getRoleById);
roleRouter.patch("/:id", dynamicAuthorize(MODULES.ROLES, "write"), validator(updateRoleSchema), role.updateRole);
roleRouter.delete("/:id", dynamicAuthorize(MODULES.ROLES, "write"), role.deleteRole);

export default roleRouter;
