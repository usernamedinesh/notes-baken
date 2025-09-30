// config/cloudinary.js
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.C_NAME,
  api_key: process.env.A_KEY,
  api_secret: process.env.A_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: ({ file }) => {
    const timestamp = Date.now();
    const publicId = `file-${timestamp}`;
    const originalName = `file-${timestamp}`;
    const cleanName = originalName
      .replace(/\s+/g, "_")
      .replace(/[^\w\-\.]/g, "");
    console.log(`Starting upload: ${file} → posts/${publicId}`);
    return {
      folder: "posts",
      allowed_formats: ["jpg", "png", "jpeg", "webp"],
      public_id: `${timestamp}-${cleanName}`,
    };
  },
});

const upload = multer({ storage });

module.exports = { upload, cloudinary };
