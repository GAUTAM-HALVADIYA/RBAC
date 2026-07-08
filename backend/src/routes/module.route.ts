import { Router } from "express";
import { ModuleController } from "../controllers/module.controller";
import { authenticate, dynamicAuthorize } from "../middleware/auth";
import { MODULES } from "../constants/modules.constants";
import { validator } from "../middleware/validator.middleware";
import { createModuleSchema, updateModuleSchema } from "../validators/module.validator";

const router = Router();
const moduleController = new ModuleController();

router.use(authenticate);

router.post("/", dynamicAuthorize(MODULES.MODULES, "write"), validator(createModuleSchema), moduleController.createModule);
router.get("/", dynamicAuthorize(MODULES.MODULES, "read"), moduleController.getModules);
router.get("/:id", dynamicAuthorize(MODULES.MODULES, "read"), moduleController.getModuleById);
router.patch("/:id", dynamicAuthorize(MODULES.MODULES, "write"), validator(updateModuleSchema), moduleController.updateModule);
router.delete("/:id", dynamicAuthorize(MODULES.MODULES, "write"), moduleController.deleteModule);

export default router;
