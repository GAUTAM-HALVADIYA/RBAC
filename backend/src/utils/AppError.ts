export class AppError extends Error {
    public readonly statusCode: number;

    constructor(statuscode: number, message: string) {
        super(message);
        this.statusCode = statuscode;
    }
}
