import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger.util";
import { errorResponse } from "../utils/response.formatter";

export const errorHandler = async(err: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    if (err.code === 11000) {
        statusCode = 409;
        const field = Object.keys(err.keyValue)[0];
        message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
    }

    if (err.name === 'ValidationError') {
        statusCode = 400;
        const errors = Object.values(err.errors).map((el: any) => el.message);
        message = `Invalid input data. ${errors.join('. ')}`;
    }

    if (err.name === 'CastError') {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}`;
    }

    logger.error(`${err.name || 'Error'}: ${message} - URL: ${req.originalUrl} - IP: ${req.ip}`);

    res.status(statusCode).json(
        errorResponse(
            message,
            process.env.NODE_ENV === 'development' ? err.stack : undefined
        )
    );
}