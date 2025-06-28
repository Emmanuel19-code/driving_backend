import express from "express";
import {
  accessSystem,
  logoutController,
  refreshTokenController,
} from "../controllers/authController.js";
import { failedAttemptLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post("/login",failedAttemptLimiter, accessSystem);
router.get("/refresh-token", refreshTokenController);
router.post("/logout", logoutController);

export default router;
