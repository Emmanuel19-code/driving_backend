import express from "express"
import { accessSystem, refreshTokenController } from "../controllers/authController.js";

const router = express.Router();

router.post("/login",accessSystem)
router.get("/refresh-token",refreshTokenController)

export default router;


