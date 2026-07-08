import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Cloudinary config
// Calling config(true) forces the SDK to re-parse the CLOUDINARY_URL from the environment
// cloudinary.config(true);

cloudinary.config({
    // secure: true,
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

// Storage config
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        let resourceType = 'auto';
        if (file.mimetype === 'application/pdf' || file.originalname.endsWith('.pdf')) {
            resourceType = 'raw';
        }

        return {
            folder: 'user_files',
            resource_type: resourceType,
        };
    },
});

export const upload = multer({ storage });
export { cloudinary };
