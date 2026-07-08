import { Request, Response, NextFunction } from "express";
import { auditLogger } from "../utils/logger.util";
import { AuditLogService } from "../services/audit-log.service";
import userModel from "../models/user.model";
import { addToQueue } from "../queue/audit.queue";
import "../queue/audit.worker";

const auditLogService = new AuditLogService();

export const auditMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const isMutation = ["POST", "PUT", "PATCH", "DELETE"].includes(req.method);
    const isAuth = req.originalUrl.includes("/api/auth");
    const isFileDownload = req.method === "GET" && req.originalUrl.includes("/download");

    if (isMutation || isAuth || isFileDownload) {
        res.on("finish", async () => {
            const status = res.statusCode >= 200 && res.statusCode < 400 ? "success" : "failure";
            let userId = req.user ? (req.user._id as string) : null;

            if (!userId && req.body && req.body.email) {
                try {
                    const user = await userModel.findOne({ email: req.body.email }).select("_id").lean();
                    if (user) {
                        userId = user._id.toString();
                    }
                } catch (err) {}
            }

            let action = `${req.method} ${req.originalUrl.split("?")[0]}`;
            if (req.originalUrl.includes("/login")) action = "USER_LOGIN";
            else if (req.originalUrl.includes("/logout")) action = "USER_LOGOUT";
            else if (req.originalUrl.includes("/verify-otp")) action = "OTP_VERIFICATION";
            else if (req.originalUrl.includes("/profile")) action = "PROFILE_UPDATE";
            else if (
                req.originalUrl.includes("/users") ||
                req.originalUrl.includes("/roles") ||
                req.originalUrl.includes("/permissions")
            )
                action = "ADMIN_ACTION";
            else if (req.originalUrl.includes("/upload") || req.originalUrl.includes("/file")) action = "FILE_OPERATION";

            if (res.statusCode === 401 || res.statusCode === 403) {
                action = "UNAUTHORIZED_ACCESS";
            }

            const ipAddress = req.ip || req.socket.remoteAddress || null;

            auditLogger.info(`Audit: User [${userId || "Unknown"}] performed action [${action}] with status ${res.statusCode}`);
            const log = {
                action,
                userId,
                ipAddress,
                status,
                metadata: {
                    url: req.originalUrl,
                    method: req.method,
                    statusCode: res.statusCode,
                    userAgent: req.get("user-agent"),
                },
            };
            addToQueue(log);
            // await auditLogService.logActivity(action, userId, ipAddress, status, {
            //     url: req.originalUrl,
            //     method: req.method,
            //     statusCode: res.statusCode,
            //     userAgent: req.get("user-agent"),
            // });
        });
    }
    next();
};
