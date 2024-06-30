import { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Like } from "../models/like.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Post } from "../models/post.model.js";
import { sendNotification } from "../utils/notification.utility.js";
import { Comment } from "../models/comment.model.js";

const togglepostLike = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  if (!isValidObjectId(postId)) {
    throw new ApiError(400, "PostId is not valid");
  }
  let like;
  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(400, "post doees not exits");
  }
  const userId = req.user._id;
  const hasLiked = await Like.findOne({ post: postId, userId });

  if (hasLiked?._id) {
    await Like.findByIdAndDelete(hasLiked._id);

    await post.likes.pull(userId);
  } else {
    like = await Like.create({
      userId,
      type: "Post",
      post: postId,
    });

    if (!like) {
      throw new ApiError(400, "Problem while liking the post");
    }

    await post.likes.push(userId);
  }

  req.body = {
    userId: post.authorId,
    type: "like",
    message: hasLiked?._id
      ? `${req.user.username} has unliked your post`
      : `${req.user.username} has liked your post`,
  };

  await sendNotification(req.body);

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        like,
        hasLiked?._id ? " unliked post sucessfully" : "liked post sucessfully"
      )
    );
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "commentId is not valid");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(400, "Comment does not exits");
  }

  const hasLiked = await comment.likes.includes(req.user._id);

  if (hasLiked) {
    comment.likes.pull(req.user._id);
    await comment.save();

    return res
      .status(200)
      .json(new ApiResponse(200, comment, "unliked the comment"));
  } else {
    comment.likes.push(req.user._id);
    await comment.save();

    return res
      .status(200)
      .json(new ApiResponse(200, comment, "liked the comment successfully"));
  }
});

const getAllLikedPostsByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Userid is not valid");
  }

  const likedposts = await Like.find({ userId })
    .populate("post", "-createdAt -updatedAt -groupId")
    .lean();

  const transformedPosts = likedposts.map((item) => ({
    _id: item._id,
    authorId: item.post.authorId,
    type: item.post.type,
    imageUrl: item.post.imageUrl,
    content: item.post.content,
    hashtags: item.post.hashtags,
    mentions: item.post.mentions,
    likes: item.post.likes,
    comments: item.post.comments,
  }));

  return res
    .status(200)
    .json(new ApiResponse(200, transformedPosts, "likedPosts"));
});

const GetPostLikes = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const likes = await Like.find({ post: postId });

  return res
    .status(200)
    .json(new ApiResponse(200, likes, "fetched all post likes"));
});

export {
  togglepostLike,
  toggleCommentLike,
  getAllLikedPostsByUserId,
  GetPostLikes,
};
