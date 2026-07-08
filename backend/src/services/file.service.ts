import fileModel from "../models/file.model";
import { cloudinary } from "../middleware/upload.middleware";
import { AppError } from "../utils/AppError";
import { HTTP_STATUS } from "../constants/http-status.constants";

export class FileService {
    async uploadFile(userId: string, fileInfo: any) {
        if (!fileInfo) {
            throw new AppError(HTTP_STATUS.BAD_REQUEST, "No file provided");
        }

        const newFile = await fileModel.create({
            name: fileInfo.originalname || fileInfo.filename,
            url: fileInfo.path,
            public_id: fileInfo.filename, 
            format: fileInfo.mimetype,
            bytes: fileInfo.size,
            user: userId,
        });

        return newFile;
    }

    async getFilesByUser(userId: string) {
        const files = await fileModel.find({ user: userId });
        return files;
    }

    async downloadFile(fileId: string, userId: string) {
        const file = await fileModel.findOne({ _id: fileId, user: userId });
        if (!file) {
            throw new AppError(HTTP_STATUS.NOT_FOUND, "File not found or unauthorized");
        }
    
        return { url: file.url, name: file.name };
    }

    async deleteFile(fileId: string, userId: string) {
        const file = await fileModel.findOne({ _id: fileId, user: userId });
        if (!file) {
            throw new AppError(HTTP_STATUS.NOT_FOUND, "File not found or unauthorized");
        }

        try {
            await cloudinary.uploader.destroy(file.public_id);
        } catch (error) {
            console.error("Cloudinary deletion error:", error);
        }

        await fileModel.findByIdAndDelete(fileId);

        return { message: "File deleted successfully" };
    }
}
