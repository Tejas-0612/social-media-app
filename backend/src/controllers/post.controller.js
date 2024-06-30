import { isValidObjectId } from "mongoose";

import { Post } from "../models/post.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendNotification } from "../utils/notification.utility.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Group } from "../models/group.model.js";

const createPost = asyncHandler(async (req, res) => {
  const { content, groupId, hashtags, mentions } = req.body;

  if (!content || content.trim() === "") {
    throw new ApiError(400, "content is required");
  }

  if (
    mentions &&
    mentions.length > 0 &&
    mentions.every((userId) => !isValidObjectId(userId))
  ) {
    throw new ApiError(400, "mention userId's are not valid");
  }

  let imageLocalPath = req.file?.path;

  let imageUrl;
  if (imageLocalPath) {
    imageUrl = await uploadOnCloudinary(imageLocalPath);
  }

  let type;
  if (!imageUrl?.url) {
    type = "text";
  } else type = "photo";

  const createdPost = await Post.create({
    authorId: req.user._id,
    type,
    imageUrl: imageUrl?.url || null,
    content,
    groupId: groupId || null,
    hashtags,
    mentions,
  });

  if (groupId != null) {
    await Group.findByIdAndUpdate(groupId, {
      $push: { posts: createdPost._id },
    });
  }

  if (mentions && mentions.length != 0) {
    mentions.every(
      async (userId) =>
        await sendNotification({
          userId,
          type: "mention",
          message: `${req.user.username} metioned you in a post`,
        })
    );
  }

  res
    .status(201)
    .json(new ApiResponse(201, createdPost, "Post created successfully"));
});

const updatePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { content, hashtags, mentions } = req.body;

  if (!isValidObjectId(postId)) {
    throw new ApiError(400, "postId is not valid");
  }

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(400, "post does not exits");
  }

  if (post.authorId.toString() !== req.user._id.toString()) {
    throw new ApiError(401, "user does not have access to update the vedio");
  }

  post.content = content || post.content;
  post.hashtags = hashtags || post.hashtags;
  post.mentions = mentions || post.mentions;
  await post.save();

  // if (
  //   mentions &&
  //   mentions.length > 0 &&
  //   mentions.every(async (userId) => {
  //     if (isValidObjectId(userId)) {
  //       await sendNotification({
  //         userId,
  //         type: "mention",
  //         message: `${req.user.username} metioned you in a post`,
  //       });
  //     }
  //   })
  // ) {
  //   throw new ApiError(400, "mention userId's are not valid");
  // }

  return res
    .status(200)
    .json(new ApiResponse(200, post, "post updated sucessfully"));
});

const getPostById = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  if (!isValidObjectId(postId)) {
    throw new ApiError(400, "postId is not valid");
  }

  const post = await Post.findById(postId)
    .populate("authorId", "avatar username fullname")
    .populate({
      path: "comments",
      select: "content createdAt",
      populate: {
        path: "userId",
        select: "avatar.url username",
      },
    });

  if (!post) {
    throw new ApiError(404, "something went wrong while getting a post");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, post, "post fetched Successfully"));
});

const deletePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  if (!isValidObjectId(postId)) {
    throw new ApiError(400, "postId is invalid");
  }

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "post does not exits");
  }

  if (post.authorId.toString() !== req.user._id.toString()) {
    throw new ApiError(401, "User is not a owner of this post");
  }

  if (post.avatar) {
    await deleteOnCloudinary(post.avatar);
  }

  const deletePost = await Post.findByIdAndDelete(postId);

  if (!deletePost) {
    throw new ApiError(500, "An error occurred while deleting the post");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "post deleted Successfully"));
});

const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ groupId: null })
    .populate("authorId", "avatar username fullname")
    .sort({ createdAt: -1 });

  if (!posts) {
    throw new ApiError(500, "Error while getting the posts");
  }

  return res.status(200).json(new ApiResponse(200, posts, "all posts fetched"));
});

const getPostByAuthorId = asyncHandler(async (req, res) => {
  const { authorId } = req.params;

  if (!isValidObjectId(authorId)) {
    throw new ApiError(400, "authorId is not valid");
  }

  const posts = await Post.find({
    authorId,
    groupId: null,
  }).populate("authorId", "avatar username");

  if (!posts) {
    throw new ApiError(500, "Error while geting posts of a user");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, posts, "all posts by userId"));
});

export {
  createPost,
  updatePost,
  getPostById,
  deletePost,
  getAllPosts,
  getPostByAuthorId,
};
