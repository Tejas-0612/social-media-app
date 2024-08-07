import jwt from "jsonwebtoken";
import { isValidObjectId } from "mongoose";

import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendNotification } from "../utils/notification.utility.js";
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();

    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, username, password } = req.body;

  if (
    [fullname, email, username, password].some(
      (field) => !field || field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const userAvatar = `https://avatar.iran.liara.run/username?username=${username}`;

  const user = await User.create({
    username: username.toLowerCase(),
    fullname,
    email,
    password,
    avatar: { url: userAvatar },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, user, "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!(email || username)) {
    throw new ApiError(400, "username or email is required");
  }

  if (!password) {
    throw new ApiError(400, "password is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    maxAge: 1 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: "none",
  };

  res.cookie("accessToken", accessToken, options);
  res.cookie("refreshToken", refreshToken, options);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: loggedInUser,
        accessToken,
        refreshToken,
      },
      "user logged in successfully"
    )
  );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out successfully"));
});

const updateProfile = asyncHandler(async (req, res) => {
  const { fullname, bio } = req.body;

  if (
    !(!(!fullname || fullname.trim() === "") || !(!bio || bio.trim() === ""))
  ) {
    throw new ApiError(400, "Either fullname or bio is missing");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullname,
        bio,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Profile updated successfully"));
});

const updateAvatar = asyncHandler(async (req, res) => {
  const avatarlocalpath = req.file?.path;

  if (!avatarlocalpath) {
    throw new ApiError(400, "error path is not defined");
  }

  const user = await User.findById(req.user._id);

  if (user.avatar.public_id) {
    await deleteOnCloudinary(user.avatar.public_id, "image");
  }

  const avatar = await uploadOnCloudinary(avatarlocalpath, "image");

  if (!avatar.url) {
    throw new ApiError(400, "Error while uploading on avatar");
  }

  const updateUser = await User.findOneAndUpdate(
    req.user?._id,
    {
      avatar: { public_id: avatar.public_id, url: avatar.url },
    },
    {
      new: true,
    }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, updateUser, "Profile Pic updated sucessfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "current user fetched successfully"));
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password Changed Successfully"));
});

const toggleFollowUser = asyncHandler(async (req, res) => {
  const { followingId } = req.params;

  if (!isValidObjectId(followingId)) {
    throw new ApiError("followingId is not valid");
  }

  if (req.user._id.toString() == followingId) {
    throw new ApiError(400, "You cannot follow yourself");
  }

  const followingUser = await User.findById(followingId);

  if (!followingUser) {
    throw new ApiError(400, "user does not exists");
  }

  const user = await User.findById(req.user._id);

  const hasFollowed = await followingUser.followers.includes(req.user._id);

  if (hasFollowed) {
    followingUser.followers.pull(req.user._id);
    user.following.pull(followingId);
  } else {
    followingUser.followers.push(req.user._id);
    user.following.push(followingId);
  }
  await followingUser.save();
  await user.save();

  req.body = {
    userId: followingId,
    type: "follow",
    message: hasFollowed
      ? `${user.username} has unfollowed you`
      : `${user.username} has followed you`,
  };

  await sendNotification(req.body);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user,
        hasFollowed ? "unfollowed successfully" : "followed successfully"
      )
    );
});

const getUserProfile = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "userId is not valid");
  }

  const user = await User.findById({ _id: userId })
    .populate("followers", "_id avatar username fullname")
    .populate("following", "_id avatar username fullname")
    .populate("groups", "_id name avatar");

  if (!user) {
    throw new ApiError(400, "user unable to fetch");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "user fetched successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError("401", "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refrehToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken,
          },
          "Access token refresh"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select(
    "_id username fullname avatar.url followers"
  );

  if (!users) {
    throw new ApiError(400, "Unable to fetch all users");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, users, "All Users fetched successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  updateProfile,
  updateAvatar,
  getCurrentUser,
  changeCurrentPassword,
  toggleFollowUser,
  getUserProfile,
  refreshAccessToken,
  getAllUsers,
};
