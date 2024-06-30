import { isValidObjectId } from "mongoose";

import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Notification } from "../models/notification.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createNotification = asyncHandler(async (req, res) => {
  const { userId, type, message } = req.body;

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

  await User.findByIdAndUpdate(userId, {
    $push: { notifications: notification._id },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, notification, "Notification created"));
});

const getAllNotifications = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (userId != req.user._id.toString()) {
    throw new ApiError(400, "user does not have acess to this");
  }
  const notifications = await Notification.find({ user: userId })
    .populate("user", "username avatar")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(200, notifications, "All notifications get successfully")
    );
});

const deleteNotificationById = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;

  if (!isValidObjectId(notificationId)) {
    throw new ApiError(400, "notificationId is not valid");
  }

  const notification = await Notification.findById(notificationId);

  if (!notification) {
    throw new ApiError(400, "Notification does not exits");
  }

  await Notification.findByIdAndDelete(notificationId);

  if (req.user._id.toString() !== notification.user.toString()) {
    throw new ApiError(
      400,
      "User does not have access to delete the notification"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Deleted notification Successfully"));
});

const markNotificationAsRead = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;

  if (!isValidObjectId(notificationId)) {
    throw new ApiError(200, "notificationId is invalid");
  }

  const notification = await Notification.findById(notificationId);

  if (!notification) {
    throw new ApiError(400, "notification does not exits");
  }

  if (req.user._id.toString() !== notification.user.toString()) {
    throw new ApiError(
      400,
      "User does not have access to read this notification"
    );
  }

  const readNotification = await Notification.findByIdAndUpdate(
    notificationId,
    {
      read: true,
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, readNotification, "changed read"));
});

export {
  createNotification,
  getAllNotifications,
  deleteNotificationById,
  markNotificationAsRead,
};
