import { getBatch } from "./audit.queue";
import { AuditLogService } from "../services/audit-log.service";
const auditLogService = new AuditLogService();

setInterval(async () => {

    const logs = getBatch(1000);

    if (logs.length === 0) return;

    try {
        await auditLogService.logActivityBatch(logs);
    } catch (err) {
        console.error("Error in audit worker batch processing:", err);
    }

}, 5000);