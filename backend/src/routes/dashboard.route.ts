import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { DashboardController } from "../controllers/dashboard.controller";

const dashboardRouter = Router();
let dashboard = new DashboardController();

dashboardRouter.use(authenticate);
dashboardRouter.get("/stats", dashboard.getStats);

export default dashboardRouter;
