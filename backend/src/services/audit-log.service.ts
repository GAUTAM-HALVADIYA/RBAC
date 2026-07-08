import auditLogModel from "../models/audit-log.model";
import { AppError } from "../utils/AppError";
import { HTTP_STATUS } from "../constants/http-status.constants";
import { PaginationOptions, getPaginatedMetadata, getPaginationOptions } from "../utils/pagination.util";

export class AuditLogService {
    async logActivity(
        action: string,
        userId: string | null,
        ipAddress: string | null,
        status: "success" | "failure",
        metadata: any = {},
    ) {
        try {
            await auditLogModel.create({
                action,
                userId,
                ipAddress,
                status,
                metadata,
            });
        } catch (error) {
            console.error("Failed to create audit log:", error);
        }
    }

    async logActivityBatch(logs: any[]) {
        try {
            if (logs.length === 0) return;
            await auditLogModel.insertMany(logs, { ordered: false });
        } catch (error) {
            console.error("Failed to create audit logs batch:", error);
        }
    }

    async getLogs(query: Record<string, any> = {}) {
        const options = getPaginationOptions(query);
        const filters: any = query;

        const filter: any = {};

        if (filters.userId) filter.userId = filters.userId;
        if (filters.action) filter.action = filters.action;
        if (filters.status) filter.status = filters.status;

        if (filters.startDate || filters.endDate) {
            filter.timestamp = {};
            if (filters.startDate) filter.timestamp.$gte = new Date(filters.startDate);
            if (filters.endDate) filter.timestamp.$lte = new Date(filters.endDate);
        }

        if (options.search) {
            filter.$or = [{ action: { $regex: options.search, $options: "i" } }];
        }

        const sort: any = {};
        if (options.sortBy) {
            sort[options.sortBy] = options.sortOrder === "asc" ? 1 : -1;
        } else {
            sort["timestamp"] = -1;
        }

        const [totalRecords, logs] = await Promise.all([
            auditLogModel.countDocuments(filter),
            auditLogModel.find(filter).populate("userId", "name email").sort(sort).skip(options.skip).limit(options.limit).lean(),
        ]);
        const meta = getPaginatedMetadata(totalRecords, options.page, options.limit);

        return { data: logs, meta };
    }
}
