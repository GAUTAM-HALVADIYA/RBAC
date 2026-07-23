import { Router } from "express";
import { authenticate, dynamicAuthorize } from "../middleware/auth";
import { UserController } from "../controllers/user.controller";
import { createUserSchema, updateUserSchema } from "../validators/user.validator";
import { validator } from "../middleware/validator.middleware";
import { MODULES } from "../constants/modules.constants";
import { upload } from "../middleware/upload.middleware";

const userRouter = Router();
let user = new UserController();

userRouter.use(authenticate);

userRouter.get("/", dynamicAuthorize(MODULES.USERS, "read"), user.getUsers);
userRouter.post("/", dynamicAuthorize(MODULES.USERS, "write"), validator(createUserSchema), user.createUsers);
userRouter.get("/profile", user.getProfile);
userRouter.patch("/profile", validator(updateUserSchema), user.updateProfile);
userRouter.post("/profile/avatar", upload.single("file"), user.uploadAvatar);
userRouter.delete("/profile/avatar", user.deleteAvatar);
userRouter.get("/:id", dynamicAuthorize(MODULES.USERS, "read"), user.getUserById);
userRouter.patch("/:id", dynamicAuthorize(MODULES.USERS, "write"), validator(updateUserSchema), user.updateUser);
userRouter.delete("/:id", dynamicAuthorize(MODULES.USERS, "write"), user.deleteUser);

export default userRouter;
