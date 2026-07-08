import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { AuthController } from "../controllers/auth.controller";
import { validator } from "../middleware/validator.middleware";
import { forgotPasswordSchema, loginSchema, refreshTokenSchema, registerSchema, resetPasswordSchema, verifyOtpSchema, resendOtpSchema } from "../validators/auth.vadidator";


const authRouter = Router();
let auth = new AuthController()

authRouter.post("/register", validator(registerSchema), auth.register);
authRouter.post("/login", validator(loginSchema), auth.login);
authRouter.post("/verify-otp",validator(verifyOtpSchema), auth.verifyOtp);
authRouter.post("/resend-otp", validator(resendOtpSchema), auth.resendOtp);
authRouter.post("/forgot-password", validator(forgotPasswordSchema),auth.forgotPassword);
authRouter.post("/reset-password", validator(resetPasswordSchema), auth.resetPassword);
authRouter.post("/refresh-token", validator(refreshTokenSchema), auth.refreshToken);
authRouter.post("/logout", authenticate, auth.logout);

export default authRouter;