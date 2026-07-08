declare module 'multer-storage-cloudinary' {
    import { StorageEngine } from 'multer';
    import { v2 as cloudinary } from 'cloudinary';

    interface Options {
        cloudinary: typeof cloudinary;
        params?: {
            folder?: string;
            format?: string | ((req: any, file: any) => string);
            public_id?: (req: any, file: any) => string;
            allowed_formats?: string[];
            [key: string]: any;
        } | ((req: any, file: any) => any);
    }

    class CloudinaryStorage implements StorageEngine {
        constructor(options: Options);
        _handleFile(req: any, file: any, cb: (error: any, info?: any) => void): void;
        _removeFile(req: any, file: any, cb: (error: any) => void): void;
    }

    export { CloudinaryStorage };
}
