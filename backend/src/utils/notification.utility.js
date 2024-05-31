import { isValidObjectId } from "mongoose";
import { Notification } from "../models/notification.model.js";
import { ApiError } from "./ApiError.js";

export const sendNotification = async ({ userId, type, message }) => {
  console.log(userId, type, message);
  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "userid is not valid");
  }

  if (!type || !message) {
    throw new ApiError(400, "type or message is missing");
  }

  const notification = await Notification.create({
    user: userId,
    type,
    message,
  });

  console.log(notification);
};
