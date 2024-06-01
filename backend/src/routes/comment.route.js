import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addComment,
  deleteCommentById,
  getAllCommentsByPostId,
  updateComment,
} from "../controllers/comment.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/add/:postId").post(addComment);
router.route("/update/:commentId").patch(updateComment);
router.route("/delete/:commentId").delete(deleteCommentById);
router.route("/post/:postId").get(getAllCommentsByPostId);

export default router;
