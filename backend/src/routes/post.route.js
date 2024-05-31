import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostByAuthorId,
  getPostById,
  updatePost,
} from "../controllers/post.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/create").post(upload.single("image"), createPost);
router.route("/update/:postId").patch(updatePost);
router.route("/:postId").get(getPostById);
router.route("/").get(getAllPosts);
router.route("/delete/:postId").delete(deletePost);
router.route("/user/:authorId").get(getPostByAuthorId);

export default router;
