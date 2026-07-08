import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/token.util";
import userModel from "../models/user.model";
import moduleModel from "../models/module.model";
import permissionModel from "../models/permission.model";
import { AppError } from "../utils/AppError";

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return next(new AppError(401, "No token provided"));
        }

        const token = authHeader.split(" ")[1];
        const decoded: any = verifyAccessToken(token);

        const user = await userModel.findById(decoded.id).populate({
            path: "role",
        });
        // const user = await userModel.findById(decoded.id).populate({
        //     path: "role",
        //     populate: { path: "permissions" }
        // });

        if (!user?.refreshToken) {
            return next(new AppError(404, "Please LOgin"));
        }
        if (!user) {
            return next(new AppError(401, "User not found"));
        }

        req.user = user as unknown as Express.Request["user"];
        next();
    } catch (error) {
        next(new AppError(401, "Invalid or expired token"));
    }
};

export const authorize = (allowedRoles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!req.user || !req.user.role) {
                return next(new AppError(403, "Access denied"));
            }

            const userRole = req.user.role.name;

            if (!allowedRoles.includes(userRole)) {
                return next(new AppError(403, "Forbidden: You do not have the required permissions"));
            }

            next();
        } catch (error) {
            next(new AppError(500, "Authorization error"));
        }
    };
};

export const dynamicAuthorize = (moduleKey: string, action: "read" | "write") => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!req.user || !req.user.role) {
                return next(new AppError(403, "Access denied"));
            }

            if (req.user.role.name.toLowerCase() === "super admin") {
                return next();
            }

            const module = await moduleModel.findOne({ key: moduleKey, isActive: true });
            if (!module) {
                return next(new AppError(404, `Module '${moduleKey}' not found or inactive`));
            }

            const permission = await permissionModel.findOne({
                roleId: (req.user.role as any)._id,
                moduleId: module._id,
            });

            if (!permission) {
                return next(new AppError(403, `Forbidden: You lack permissions for '${moduleKey}' module`));
            }

            let hasPermission = false;
            if (action === "read") {
                hasPermission = permission.permissions.read || permission.permissions.write;
            } else if (action === "write") {
                hasPermission = permission.permissions.write;
            }

            if (!hasPermission) {
                return next(new AppError(403, `Forbidden: You lack required permission for '${moduleKey}'`));
            }

            next();
        } catch (error) {
            next(new AppError(500, "Authorization error"));
        }
    };
};
