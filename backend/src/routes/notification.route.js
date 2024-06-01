import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  deleteNotificationById,
  getAllNotifications,
  markNotificationAsRead,
} from "../controllers/notification.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/user/:userId").get(getAllNotifications);
router.route("/delete/:notificationId").delete(deleteNotificationById);
router.route("/read/:notificationId").patch(markNotificationAsRead);

export default router;
