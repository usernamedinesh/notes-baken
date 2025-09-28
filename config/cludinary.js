const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.C_NAME,
  api_key: process.env.A_KEY,
  api_secret: process.env.A_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: ({ file }) => {
    const timestamp = Date.now();
    const originalName = file?.originalname || `file-${timestamp}`;
    return {
      folder: "posts",
      allowed_formats: ["jpg", "png", "jpeg", "webp"],
      public_id: `${timestamp}-${originalName}`,
    };
  },
});

module.exports = { cloudinary, storage };
