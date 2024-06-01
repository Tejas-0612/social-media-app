import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createGroup,
  updateGroup,
  deleteGroup,
  getGroupById,
  getAllGroups,
  joinGroup,
  exitGroup,
  getPostsByGroupId,
} from "../controllers/group.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/create").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  createGroup
);
router.route("/update/:groupId").patch(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  updateGroup
);
router.route("/").get(getAllGroups);
router.route("/:groupId").get(getGroupById);
router.route("/delete/:groupId").delete(deleteGroup);
router.route("/join/:groupId").patch(joinGroup);
router.route("/exit/:groupId").patch(exitGroup);
router.route("/posts/:groupId").get(getPostsByGroupId);
export default router;
