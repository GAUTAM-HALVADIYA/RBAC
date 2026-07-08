import { Router } from "express";
import { authenticate, dynamicAuthorize } from "../middleware/auth";
import { AuditLogController } from "../controllers/audit-log.controller";
import { MODULES } from "../constants/modules.constants";

const auditLogRouter = Router();
const auditLog = new AuditLogController();

auditLogRouter.use(authenticate);

auditLogRouter.get("/", dynamicAuthorize(MODULES.AUDIT_LOGS, "read"), auditLog.getLogs);

export default auditLogRouter;
