import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log("File is uploaded on cloudinary", response.url);
    fs.unlinkSync(localFilePath);
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
    console.log(deleteRespone);
    return deleteResponse;
  } catch (error) {
    console.log(error);
  }
};

export { uploadOnCloudinary, deleteOnCloudinary };
