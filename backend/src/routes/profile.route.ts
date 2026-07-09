import { Router } from "express";
import { authenticate, dynamicAuthorize } from "../middleware/auth";
import { ProfileController } from "../controllers/profile.controller";
import { validator } from "../middleware/validator.middleware";
import { updateProfileSchema } from "../validators/profile.validator";
import { MODULES } from "../constants/modules.constants";
import { upload } from "../middleware/upload.middleware";

const profileRouter = Router();
let profile = new ProfileController()

profileRouter.use(authenticate);

profileRouter.post("/", dynamicAuthorize(MODULES.PROFILE, "write"), profile.createProfile);
profileRouter.get("/", dynamicAuthorize(MODULES.PROFILE, "read"), profile.getProfile);
profileRouter.patch("/", dynamicAuthorize(MODULES.PROFILE, "write"), validator(updateProfileSchema), profile.updateProfile);
profileRouter.delete("/", dynamicAuthorize(MODULES.PROFILE, "write"), profile.deleteProfile);

profileRouter.post("/avatar", dynamicAuthorize(MODULES.PROFILE, "write"), upload.single("file"), profile.uploadAvatar);
profileRouter.delete("/avatar", dynamicAuthorize(MODULES.PROFILE, "write"), profile.deleteAvatar);

export default profileRouter;
