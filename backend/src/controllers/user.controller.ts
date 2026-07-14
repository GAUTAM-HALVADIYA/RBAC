import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";
import { HTTP_STATUS } from "../constants/http-status.constants";

const userService = new UserService();

export class UserController {
    getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const currentUserId = req.user?._id.toString();
            const { data, meta } = await userService.getUsers(req.query, currentUserId);
            res.status(HTTP_STATUS.OK).json({ success: true, data, meta });
        } catch (error) {
            next(error);
        }
    };

    getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const user = await userService.getUserById(req.params.id as string);
            res.status(HTTP_STATUS.OK).json({ success: true, data: user });
        } catch (error) {
            next(error);
        }
    };

    updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const currentUserRole = req.user!.role.name;
            const targetUser = await userService.updateUser(req.params.id as string, currentUserRole, req.body);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: "User updated successfully",
                data: targetUser,
            });
        } catch (error) {
            next(error);
        }
    };

    deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const currentUserRole = req.user!.role.name;
            await userService.deleteUser(req.params.id as string, currentUserRole, req.user?._id as string);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: "User deleted successfully",
            });
        } catch (error) {
            next(error);
        }
    };

    getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user!._id.toString();
            const user = await userService.getProfile(userId);
            res.status(HTTP_STATUS.OK).json({ success: true, data: user });
        } catch (error) {
            next(error);
        }
    };

    updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user!._id.toString();
            const user = await userService.updateProfile(userId, req.body);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: "Profile updated successfully",
                data: user,
            });
        } catch (error) {
            next(error);
        }
    };

    uploadAvatar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user!._id.toString();
            const user = await userService.uploadAvatar(userId, req.file);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: "Avatar uploaded successfully",
                data: user,
            });
        } catch (error) {
            next(error);
        }
    };

    deleteAvatar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user!._id.toString();
            const user = await userService.deleteAvatar(userId);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: "Avatar deleted successfully",
                data: user,
            });
        } catch (error) {
            next(error);
        }
    };
}
