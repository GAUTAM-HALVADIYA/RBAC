import express from "express";
import cors from "cors";
import { Request, Response } from "express";
import "dotenv/config";
import helmet from "helmet";
import morgan from "morgan";
import dbConnection from "./config/connection";
import roleRouter from "./routes/role.route";
import userRouter from "./routes/user.route";
import authRouter from "./routes/auth.route";
import profileRouter from "./routes/profile.route";
import moduleRouter from "./routes/module.route";
import fileRouter from "./routes/file.route";
import permissionRouter from "./routes/permission.route";
import auditLogRouter from "./routes/audit-log.route";
import bcrypt from "bcrypt";
import { errorHandler } from "./middleware/error.middleware";
import logger from "./utils/logger.util";
import { auditMiddleware } from "./middleware/audit.middleware";
import roleModel from "./models/role.model";

const app = express();
const PORT = 3000;

// bcrypt.hash("Admin@123", 10, function(err, res) {
//     console.log(res);
// });

app.use(helmet());

app.use(
    cors({
        origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true, 
    })
);

const morganFormat = process.env.NODE_ENV === "production" ? "combined" : "dev";
app.use(
    morgan(morganFormat, {
        stream: {
            write: (message) => logger.http(message.trim()),
        },
    }),
);

app.use(express.json());

app.use(auditMiddleware);

app.use("/api/roles", roleRouter);
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/modules", moduleRouter);
app.use("/api/files", fileRouter);
app.use("/api/permissions", permissionRouter);
app.use("/api/audit-logs", auditLogRouter);

app.use(errorHandler);

dbConnection().then(() => {
    app.listen(PORT, () => {
        logger.info(`Server running on port http://localhost:${PORT}`);
    });
});
