import { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Post } from "../models/post.model.js";
import { Save } from "../models/save.model.js";
import { sendNotification } from "../utils/notification.utility.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

const toggleSavePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  if (!isValidObjectId(postId)) {
    throw new ApiError(400, "PostId is not valid");
  }

  let save;
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(400, "post does not exists");
  }

  const userId = req.user._id;
  const hasSaved = await Save.findOne({ post: postId, userId });

  if (hasSaved?._id) {
    await User.findByIdAndUpdate(
      userId,
      { $pull: { savedPosts: postId } },
      { new: true }
    );

    await Save.findByIdAndDelete(hasSaved._id);
  } else {
    save = await Save.create({
      userId,
      type: post.imageUrl ? "post" : "text",
      post: postId,
    });

    await User.findByIdAndUpdate(
      userId,
      { $push: { savedPosts: postId } },
      { new: true }
    );

    if (!save) {
      throw new ApiError(400, "Problem while saving the post");
    }
  }
  req.body = {
    userId: post.authorId,
    type: "save",
    message: hasSaved?._id
      ? `${req.user.username} has unsaved your post`
      : `${req.user.username} has saved your post`,
  };

  await sendNotification(req.body);

  return res
    .status(201)
    .json(new ApiResponse(200, save, "save/unsaved the post"));
});

const getAllSavedPostsByUserId = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  if (!isValidObjectId) {
    throw new ApiError(400, "userId is not valid");
  }

  const savedPosts = await Save.find({ userId }).populate({
    path: "post",
    select: "-createdAt -updatedAt -groupId",
    populate: { path: "authorId", select: "avatar username fullname" },
  });

  return res.status(200).json(new ApiResponse(200, savedPosts, "saved posts"));
});

export { toggleSavePost, getAllSavedPostsByUserId };
