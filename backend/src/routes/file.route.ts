import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { FileController } from "../controllers/file.controller";
import { upload } from "../middleware/upload.middleware";

const fileRouter = Router();
const fileController = new FileController();

fileRouter.use(authenticate);

fileRouter.post("/upload", upload.single("file"), fileController.uploadFile);
fileRouter.get("/", fileController.getFiles);
fileRouter.get("/:id/download", fileController.downloadFile);
fileRouter.delete("/:id", fileController.deleteFile);

export default fileRouter;
