export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    meta?: any;
    error?: any;
}

export const successResponse = <T>(
    message: string,
    data?: T,
    meta?: any,
): ApiResponse<T> => {
    return {
        success: true,
        message,
        data,
        meta,
    };
};

export const errorResponse = (message: string, error?: any): ApiResponse => {
    return {
        success: false,
        message,
        error,
    };
};
