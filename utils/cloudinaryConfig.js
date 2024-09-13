const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config(); // โหลดค่าจากไฟล์ .env

// ตรวจสอบว่าตัวแปรสำคัญถูกตั้งค่าหรือไม่
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary configuration is missing. Please check your environment variables.");
}

// ตั้งค่า Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = cloudinary;
