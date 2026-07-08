declare namespace Express {
    export interface Request {
        user?: {
            _id: import("mongoose").Types.ObjectId | string;
            role: {
                name: string;
                permissions: any[];
            };
        };
    }
}