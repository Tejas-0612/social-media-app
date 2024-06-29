import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  GetPostLikes,
  getAllLikedPostsByUserId,
  toggleCommentLike,
  togglepostLike,
} from "../controllers/like.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/post/:postId").patch(togglepostLike);
router.route("/comment/:commentId").patch(toggleCommentLike);
router.route("/user/:userId").get(getAllLikedPostsByUserId);
router.route("/:postId").get(GetPostLikes);

export default router;
