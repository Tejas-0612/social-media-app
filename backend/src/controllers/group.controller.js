import { isValidObjectId } from "mongoose";

import { Group } from "../models/group.model.js";
import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";

const createGroup = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    throw new ApiError(400, "title or description is missing");
  }

  const existedGroup = await Group.findOne({ name });

  if (existedGroup) {
    throw new ApiError(409, "Group with similar name is already present");
  }
  const avatarLocalPath = req.files?.avatar?.[0]?.path;

  console.log(req.files);
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  let coverImage;
  if (coverImageLocalPath) {
    coverImage = await uploadOnCloudinary(coverImageLocalPath);
  }

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const createGroup = await Group.create({
    name,
    description,
    admin: req.user._id,
    "avatar.public_id": avatar.public_id,
    "avatar.url": avatar.url,
    "coverImage.url": coverImage?.url,
    "coverImage.public_id": coverImage?.public_id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, createGroup, "Group created successfully"));
});

const updateGroup = asyncHandler(async (req, res) => {
  const { groupId } = req.params;
  const { name, description } = req.body;

  const avatarLocalPath = req.files?.avatar?.[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!isValidObjectId(groupId)) {
    throw new ApiError(400, "GroupId id not valid");
  }

  if (!(!name || !description)) {
    throw new ApiError(400, "name or description is missing");
  }

  const group = await Group.findById(groupId);

  if (!group) {
    throw new ApiError(400, "Group does not exits");
  }

  if (group.admin.toString() !== req.user._id.toString()) {
    throw new ApiError(400, "user is not admin of group");
  }

  let avatar, coverImage;
  if (avatarLocalPath) {
    avatar = await uploadOnCloudinary(avatarLocalPath);
    await deleteOnCloudinary(group.avatar.public_id, "image");
  }

  if (coverImageLocalPath) {
    coverImage = await uploadOnCloudinary(coverImageLocalPath);
    await deleteOnCloudinary(group.coverImage.public_id, "image");
  }

  const updatedGroup = await Group.findByIdAndUpdate(
    groupId,
    {
      name: name || group.name,
      description: description || group.description,
      "avatar.public_id": avatar?.public_id || group.avatar.public_id,
      "avatar.url": avatar?.url || group.avatar.url,
      "coverImage.public_id":
        coverImage?.public_id || group.coverImage.public_id,
      "coverImage.url": coverImage?.url || group.coverImage.url,
    },
    { new: true }
  );

  if (!updatedGroup) {
    throw new ApiError(400, "Group failed to update");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedGroup, "Group updated successfully"));
});

const getGroupById = asyncHandler(async (req, res) => {
  const { groupId } = req.params;

  if (!isValidObjectId(groupId)) {
    throw new ApiError(400, "groupId is not valid");
  }

  const group = await Group.findById(groupId).populate(
    "admin",
    "username avatar fullname"
  );

  if (!group) {
    throw new ApiError(400, "group is not getting");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, group, "Group details fetched succesfully"));
});

const getAllGroups = asyncHandler(async (req, res) => {
  const groups = await Group.find().populate(
    "admin",
    "username avatar fullname"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, groups, "All groups fetched successfully"));
});

const deleteGroup = asyncHandler(async (req, res) => {
  const { groupId } = req.params;

  if (!isValidObjectId(groupId)) {
    throw new ApiError(400, "groupId is not valid");
  }

  const group = await Group.findById(groupId);

  if (!group) {
    throw new ApiError(400, "group does not exits");
  }

  if (group.admin.toString() !== req.user._id.toString()) {
    throw new ApiError(400, "user is not admin of group");
  }

  if (group.avatar) {
    await deleteOnCloudinary(group.avatar);
  }

  if (group.coverImage) {
    await deleteOnCloudinary(group.coverImage);
  }

  const posts = await Post.find({ groupId });

  for (const post of posts) {
    if (post.avatar) {
      await deleteOnCloudinary(post.avatar);
    }
  }

  await Post.deleteMany({ groupId });

  // await User.updateMany(
  //   { _id: { $in: group.members } },
  //   { $pull: { groups: groupId } }
  // );

  const deleteResponse = await Group.findByIdAndDelete(groupId);

  if (!deleteResponse) {
    throw new ApiError(500, "Something went wrong");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deleteResponse, "Group deleted successfully"));
});

const joinGroup = asyncHandler(async (req, res) => {
  const { groupId } = req.params;

  if (!isValidObjectId(groupId)) {
    throw new ApiError(400, "groupId is not valid");
  }

  const group = await Group.findById(groupId);

  if (!group) {
    throw new ApiError(400, "Group does not exits");
  }

  if (
    group.members.includes(req.user._id) ||
    group.admin.toString() === req.user._id.toString()
  ) {
    throw new ApiError(400, "You are already a member or admin of group");
  }

  const updateGroup = await group.members.push(req.user._id);
  await group.save();
  if (!updateGroup) {
    throw new ApiError(500, "error while joining a group");
  }

  return res.status(200).json(new ApiResponse(200, group, "joined the group"));
});

const exitGroup = asyncHandler(async (req, res) => {
  const { groupId } = req.params;

  if (!isValidObjectId(groupId)) {
    throw new ApiError(400, "groupId is not valid");
  }

  const group = await Group.findById(groupId);

  if (!group) {
    throw new ApiError(400, "Group does not exits");
  }

  const groupMember = await group.members.includes(req.user._id);

  if (!groupMember) {
    throw new ApiError(400, "user is not a part of group");
  }

  const removeMember = await group.members.pull(req.user._id);
  await group.save();

  if (!removeMember) {
    throw new ApiError(500, "unable to left the group");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "left the group successfully"));
});

const getPostsByGroupId = asyncHandler(async (req, res) => {
  const { groupId } = req.params;

  if (!isValidObjectId(groupId)) {
    throw new ApiError(400, "groupId id not valid");
  }

  const group = await Group.findById(groupId);

  if (!group) {
    throw new ApiError(400, "group does not exit");
  }

  if (
    !group.members.includes(req.user._id) &&
    req.user._id.toString() !== group.admin.toString()
  ) {
    throw new ApiError(400, "User does not have acess to this group");
  }

  const posts = await Post.find({ groupId });

  return res
    .status(200)
    .json(new ApiResponse(200, posts, "fetched posts sucessfully"));
});

const getGroupsByUserId = asyncHandler(async (req, res) => {
  const user = req.user;

  const groups = await Group.find({ admin: user._id });

  if (!groups) {
    throw new ApiError(400, "Groups are unable to fetch");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, groups, "USer groups fetched successfully"));
});

export {
  createGroup,
  updateGroup,
  getGroupById,
  getAllGroups,
  deleteGroup,
  joinGroup,
  exitGroup,
  getPostsByGroupId,
  getGroupsByUserId,
};
