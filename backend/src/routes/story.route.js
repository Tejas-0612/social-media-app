import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createStory, getStories } from "../controllers/story.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/get-stories").get(getStories);
router.route("/create").post(upload.single("media"), createStory);

export default router;
