import { Request, Response, NextFunction } from "express";
import { RoleService } from "../services/role.service";
import { HTTP_STATUS } from "../constants/http-status.constants";

const roleService = new RoleService();

export class RoleController {
    createRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const role = await roleService.createRole(req.body);
            res.status(HTTP_STATUS.CREATED).json({
                success: true,
                message: "Role created successfully",
                data: role,
            });
        } catch (error) {
            next(error);
        }
    };

    getRoles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { data, meta } = await roleService.getRoles(req.query);
            res.status(HTTP_STATUS.OK).json({ success: true, data, meta });
        } catch (error) {
            next(error);
        }
    };

    getRoleById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const role = await roleService.getRoleById(req.params.id as string);
            res.status(HTTP_STATUS.OK).json({ success: true, data: role });
        } catch (error) {
            next(error);
        }
    };

    updateRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const role = await roleService.updateRole(req.params.id as string, req.body);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: "Role updated successfully",
                data: role,
            });
        } catch (error) {
            next(error);
        }
    };

    deleteRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await roleService.deleteRole(req.params.id as string);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: "Role deleted successfully",
            });
        } catch (error) {
            next(error);
        }
    };
}
