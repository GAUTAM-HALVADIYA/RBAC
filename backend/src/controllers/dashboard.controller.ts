import { Request, Response, NextFunction } from "express";
import { DashboardService } from "../services/dashboard.service";
import { HTTP_STATUS } from "../constants/http-status.constants";

const dashboardService = new DashboardService();

export class DashboardController {
    getStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const stats = await dashboardService.getStats();
            res.status(HTTP_STATUS.OK).json({ success: true, data: stats });
        } catch (error) {
            next(error);
        }
    };
}
