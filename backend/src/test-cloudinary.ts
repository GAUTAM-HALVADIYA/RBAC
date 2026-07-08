import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

async function testUpload() {
    try {
        console.log("Testing cloudinary connection...");
        const result = await cloudinary.uploader.upload("https://cloudinary-res.cloudinary.com/image/upload/cloudinary_logo.png", {
            folder: "test",
        });
        console.log("Success! File uploaded:", result.secure_url);
    } catch (error) {
        console.error("Cloudinary Error:", error);
    }
}

testUpload();
