import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";
import { HTTP_STATUS } from "../constants/http-status.constants";

const userService = new UserService();

export class UserController {
    getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { data, meta } = await userService.getUsers(req.query);
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
            await userService.deleteUser(req.params.id as string, currentUserRole);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: "User deleted successfully",
            });
        } catch (error) {
            next(error);
        }
    };
}
