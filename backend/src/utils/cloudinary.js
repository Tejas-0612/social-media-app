import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// process.loadEnvFile();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "Moments",
    });

    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlink(localFilePath);
    return null;
  }
};

const deleteOnCloudinary = async (publicId, resource_type) => {
  try {
    if (!publicId) return null;
    const deleteResponse = await cloudinary.uploader.destroy(
      publicId,
      resource_type
    );

    return deleteResponse;
  } catch (error) {
    console.log(error);
  }
};

export { uploadOnCloudinary, deleteOnCloudinary };
