import { NextFunction, Request, RequestHandler, Response } from "express";
import { ZodSchema } from "zod/v3";
import { AppError } from "../utils/AppError";
import { error } from "node:console";

export const validator = (schema: ZodSchema): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        let result = schema.safeParse(req.body);

        if (!result.success) {
            const errorMessage = result.error.issues
                .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
                .join(", ");

                console.log(result.error);
            return next(new AppError(400, errorMessage));
        }

        next();
    };
};
