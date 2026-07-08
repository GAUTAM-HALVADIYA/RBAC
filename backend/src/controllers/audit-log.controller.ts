import { Request, Response, NextFunction } from "express";
import { AuditLogService } from "../services/audit-log.service";
import { HTTP_STATUS } from "../constants/http-status.constants";

const auditLogService = new AuditLogService();

export class AuditLogController {
    getLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { data, meta } = await auditLogService.getLogs(req.query);

            res.status(HTTP_STATUS.OK).json({ success: true, data, meta });
        } catch (error) {
            next(error);
        }
    };
}
