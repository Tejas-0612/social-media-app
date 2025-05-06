import { Story } from "../models/story.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";

const createStory = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const mediaLocalPath = req.file.path;

  if (!mediaLocalPath) {
    throw new ApiError(400, "Media file is required");
  }

  const media = await uploadOnCloudinary(mediaLocalPath);

  if (!media) {
    throw new ApiError(400, "media file is required");
  }

  const story = await Story.create({
    user: userId,
    mediaUrl: media.secure_url,
    mediaType: media.resource_type,
  });

  if (!story) {
    throw new ApiError(500, "Something went wrong while creating the story ");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, story, "Story created Successfully"));
});

const getStories = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId).select("following");

  const followingUsers = [...user.following, userId]; // to get self story for user

  const stories = await Story.aggregate([
    {
      $match: {
        user: {
          $in: followingUsers.map((id) => new mongoose.Types.ObjectId(id)),
        },
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $group: {
        _id: "$user",
        stories: { $push: "$$ROOT" },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "userInfo",
      },
    },
    {
      $unwind: "$userInfo",
    },
    {
      $project: {
        _id: 0,
        user: {
          _id: "$userInfo._id",
          username: "$userInfo.username",
          fullname: "$userInfo.fullname",
          avatar: "$userInfo.avatar",
        },
        stories: 1,
      },
    },
  ]);

  if (!stories) {
    throw new ApiError(500, "Error while getting the stories");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, stories, "all stories fetched"));
});

export { createStory, getStories };
