import { Request, Response, NextFunction } from "express";
import https from "https";
import { FileService } from "../services/file.service";
import { HTTP_STATUS } from "../constants/http-status.constants";
import { successResponse } from "../utils/response.formatter";

const fileService = new FileService();

export class FileController {
    uploadFile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user!._id;
            const file = await fileService.uploadFile(userId as string, req.file);
            res.status(HTTP_STATUS.CREATED).json(successResponse("File uploaded successfully", file));
        } catch (error) {
            next(error);
        }
    };

    getFiles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user!._id;
            const files = await fileService.getFilesByUser(userId as string);
            res.status(HTTP_STATUS.OK).json(successResponse("Files retrieved successfully", files));
        } catch (error) {
            next(error);
        }
    };

    downloadFile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user!._id;
            const fileData = await fileService.downloadFile(req.params.id as string, userId as string);
            https
                .get(fileData.url, (stream) => {
                    res.setHeader("Content-Disposition", `attachment; filename="${fileData.name}"`);
                    stream.pipe(res);
                })
                .on("error", (err) => {
                    next(err);
                });
        } catch (error) {
            next(error);
        }
    };

    deleteFile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user!._id;
            const result = await fileService.deleteFile(req.params.id as string, userId as string);
            res.status(HTTP_STATUS.OK).json(successResponse(result.message));
        } catch (error) {
            next(error);
        }
    };
}
