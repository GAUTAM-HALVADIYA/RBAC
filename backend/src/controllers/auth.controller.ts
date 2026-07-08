import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { HTTP_STATUS } from "../constants/http-status.constants";
import { authLogger } from "../utils/logger.util";
import { successResponse } from "../utils/response.formatter";

const authService = new AuthService();

export class AuthController {
    register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data = await authService.register(req.body);
            authLogger.info(`User registered successfully: ${req.body.email || req.body.username}`);
            res.status(HTTP_STATUS.CREATED).json(successResponse("User registered. Please check console for OTP to verify.", data));
        } catch (error) {
            next(error);
        }
    };

    verifyOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data = await authService.verifyOtp(req.body);
            authLogger.info(`OTP verified successfully: ${req.body.email || req.body.username}`);
            res.status(HTTP_STATUS.OK).json(successResponse("OTP verified successfully", data));
        } catch (error) {
            next(error);
        }
    };

    resendOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await authService.resendOtp(req.body);
            authLogger.info(`OTP resent successfully: ${req.body.email}`);
            res.status(HTTP_STATUS.OK).json(successResponse("OTP resent successfully. Please check console."));
        } catch (error) {
            next(error);
        }
    };

    login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await authService.login(req.body);
            authLogger.info(`Login OTP generated for: ${req.body.email || req.body.username}`);
            res.status(HTTP_STATUS.OK).json(successResponse("Login OTP generated. Please check console to verify."));
        } catch (error) {
            next(error);
        }
    };

    forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await authService.forgotPassword(req.body);
            authLogger.info(`Forgot password initiated for: ${req.body.email || req.body.username}`);
            res.status(HTTP_STATUS.OK).json(successResponse("OTP sent for password reset. Check console."));
        } catch (error) {
            next(error);
        }
    };

    resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await authService.resetPassword(req.body);
            authLogger.info(`Password reset successfully for: ${req.body.email || req.body.username}`);
            res.status(HTTP_STATUS.OK).json(successResponse("Password reset successfully"));
        } catch (error) {
            next(error);
        }
    };

    refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data = await authService.refreshToken(req.body);
            authLogger.info(`Token refreshed successfully`);
            res.status(HTTP_STATUS.OK).json(successResponse("Token refreshed successfully", data));
        } catch (error) {
            next(error);
        }
    };

    logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?._id;
            await authService.logout(userId as string);
            authLogger.info(`User logged out: ${userId}`);
            res.status(HTTP_STATUS.OK).json(successResponse("Logged out successfully"));
        } catch (error) {
            next(error);
        }
    };
}
