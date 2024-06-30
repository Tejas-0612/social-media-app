import { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Post } from "../models/post.model.js";
import { Comment } from "../models/comment.model.js";
import { sendNotification } from "../utils/notification.utility.js";

const addComment = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;

  if (!isValidObjectId(postId)) {
    throw new ApiError(400, "postId is not valid");
  }

  if (!content || content.trim() === "") {
    throw new ApiError(400, "content is required");
  }

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(400, "post does not exits");
  }

  const comment = await Comment.create({
    userId: req.user._id,
    postId,
    content,
  });

  if (!comment) {
    throw new ApiError(400, "unable to add comment");
  }

  await Post.updateOne({ _id: post._id }, { $push: { comments: comment._id } });

  let message = {
    userId: post.authorId,
    type: "comment",
    message: `${req.user.username} commented on your post`,
  };

  await sendNotification(message);

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "comment added successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { commentId } = req.params;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "commentId is not valid");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(400, "comment does not exist");
  }

  if (comment.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(400, "user does not have access to update this comment");
  }

  const updateComment = await Comment.findByIdAndUpdate(
    commentId,
    {
      content,
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updateComment, "updated the comment"));
});

const deleteCommentById = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "commentId is not valid");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(400, "comment does not exits");
  }

  if (req.user._id.toString() != comment.userId.toString()) {
    throw new ApiError(400, "User does not has access to delete the comment");
  }

  await Comment.findByIdAndDelete(commentId);

  await Post.updateOne(
    { _id: comment.postId },
    { $pull: { comments: comment._id } }
  );

  return res.status(200).json(new ApiResponse(200, {}, "deleted the comment"));
});

const getAllCommentsByPostId = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  if (!isValidObjectId(postId)) {
    throw new ApiError(400, "postId is not valid");
  }

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(400, "Post does not exits");
  }

  const comments = await Comment.find({ postId }).populate(
    "userId",
    "avatar username  -_id"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "get all comment"));
});

export { addComment, updateComment, deleteCommentById, getAllCommentsByPostId };
