import { Request, Response, NextFunction } from "express";
import { PermissionService } from "../services/permission.service";
import { HTTP_STATUS } from "../constants/http-status.constants";
import { getPaginationOptions } from "../utils/pagination.util";

const permissionService = new PermissionService();

export class PermissionController {
    createPermission = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const permission = await permissionService.createPermission(req.body);
            res.status(HTTP_STATUS.CREATED).json({ success: true, message: "Permission created successfully", data: permission });
        } catch (error) {
            next(error);
        }
    };

    getPermissions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { data, meta } = await permissionService.getPermissions(req.query);
            res.status(HTTP_STATUS.OK).json({ success: true, data, meta });
        } catch (error) {
            next(error);
        }
    };

    getPermissionById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const permission = await permissionService.getPermissionById(req.params.id as string);
            res.status(HTTP_STATUS.OK).json({ success: true, data: permission });
        } catch (error) {
            next(error);
        }
    };

    updatePermission = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const permission = await permissionService.updatePermission(req.params.id as string, req.body);
            res.status(HTTP_STATUS.OK).json({ success: true, message: "Permission updated successfully", data: permission });
        } catch (error) {
            next(error);
        }
    };

    deletePermission = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await permissionService.deletePermission(req.params.id as string);
            res.status(HTTP_STATUS.OK).json({ success: true, message: "Permission deleted successfully" });
        } catch (error) {
            next(error);
        }
    };
}
