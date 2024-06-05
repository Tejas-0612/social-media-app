import { Router } from "express";

import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateProfile,
  getUserProfile,
  updateAvatar,
  toggleFollowUser,
  changeCurrentPassword,
  refreshAccessToken,
  getAllUsers,
} from "../controllers/user.controller.js";

const router = Router();

//public routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

//secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-profile").patch(verifyJWT, updateProfile);
router.route("/profile/:userId").get(verifyJWT, getUserProfile);
router
  .route("/update-avatar")
  .patch(verifyJWT, upload.single("avatar"), updateAvatar);
router.route("/change-password").patch(verifyJWT, changeCurrentPassword);
router.route("/follow/:followingId").patch(verifyJWT, toggleFollowUser);
router.route("/refresh-token").post(verifyJWT, refreshAccessToken);
router.route("/all-users").get(verifyJWT, getAllUsers);

export default router;
