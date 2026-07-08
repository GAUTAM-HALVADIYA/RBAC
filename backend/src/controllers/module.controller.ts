import { Request, Response, NextFunction } from "express";
import { ModuleService } from "../services/module.service";
import { HTTP_STATUS } from "../constants/http-status.constants";
import { getPaginationOptions } from "../utils/pagination.util";

const moduleService = new ModuleService();

export class ModuleController {
    createModule = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const module = await moduleService.createModule(req.body);
            res.status(HTTP_STATUS.CREATED).json({ success: true, message: "Module created successfully", data: module });
        } catch (error) {
            next(error);
        }
    };

    getModules = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { data, meta } = await moduleService.getModules(req.query);
            res.status(HTTP_STATUS.OK).json({ success: true, data, meta });
        } catch (error) {
            next(error);
        }
    };

    getModuleById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const module = await moduleService.getModuleById(req.params.id as string);
            res.status(HTTP_STATUS.OK).json({ success: true, data: module });
        } catch (error) {
            next(error);
        }
    };

    updateModule = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const module = await moduleService.updateModule(req.params.id as string, req.body);
            res.status(HTTP_STATUS.OK).json({ success: true, message: "Module updated successfully", data: module });
        } catch (error) {
            next(error);
        }
    };

    deleteModule = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await moduleService.deleteModule(req.params.id as string);
            res.status(HTTP_STATUS.OK).json({ success: true, message: "Module deleted successfully" });
        } catch (error) {
            next(error);
        }
    };
}
