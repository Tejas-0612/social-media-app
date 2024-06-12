import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getAllSavedPostsByUserId,
  toggleSavePost,
} from "../controllers/save.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/:postId").patch(toggleSavePost);
router.route("/").get(getAllSavedPostsByUserId);

export default router;
