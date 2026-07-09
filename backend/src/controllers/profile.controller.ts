import { Request, Response, NextFunction } from "express";
import { ProfileService } from "../services/profile.service";
import { HTTP_STATUS } from "../constants/http-status.constants";

const profileService = new ProfileService();

export class ProfileController {
    createProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user!._id.toString();
            const profile = await profileService.createProfile(userId, req.body);
            res.status(HTTP_STATUS.CREATED).json({
                success: true,
                message: "Profile created successfully",
                data: profile,
            });
        } catch (error) {
            next(error);
        }
    };

    getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user!._id.toString();
            const profile = await profileService.getProfile(userId);
            res.status(HTTP_STATUS.OK).json({ success: true, data: profile });
        } catch (error) {
            next(error);
        }
    };

    updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user!._id.toString();
            const profile = await profileService.updateProfile(userId, req.body);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: "Profile updated successfully",
                data: profile,
            });
        } catch (error) {
            next(error);
        }
    };

    deleteProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user!._id.toString();
            const deletedProfile = await profileService.deleteProfile(userId);
            res.status(HTTP_STATUS.OK).json({ success: true, data: deletedProfile });
        } catch (error) {
            next(error);
        }
    };

    uploadAvatar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user!._id.toString();
            const profile = await profileService.uploadAvatar(userId, req.file);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: "Avatar uploaded successfully",
                data: profile,
            });
        } catch (error) {
            next(error);
        }
    };

    deleteAvatar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user!._id.toString();
            const profile = await profileService.deleteAvatar(userId);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: "Avatar deleted successfully",
                data: profile,
            });
        } catch (error) {
            next(error);
        }
    };
}
