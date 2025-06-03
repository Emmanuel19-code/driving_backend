import express from "express"
import { registerService } from "../controllers/serviceOffered.js";

const router = express.Router();


router.post("/add_newService",registerService)

export default router;