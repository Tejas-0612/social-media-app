import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getAllLikedPostsByUserId,
  toggleCommentLike,
  togglepostLike,
} from "../controllers/like.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/post/:postId").patch(togglepostLike);
router.route("/comment/:commentId").patch(toggleCommentLike);
router.route("/user/:userId").post(getAllLikedPostsByUserId);
export default router;
