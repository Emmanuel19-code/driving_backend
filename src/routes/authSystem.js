import express from "express"
import { accessSystem } from "../controllers/authController.js";

const router = express.Router();

router.post("/login",accessSystem)

export default router;


