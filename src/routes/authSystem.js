import express from "express";
import {
  accessSystem,
  logoutController,
  refreshTokenController,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/login", accessSystem);
router.get("/refresh-token", refreshTokenController);
router.post("/logout", logoutController);

export default router;
