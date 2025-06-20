import express from 'express'
import { registerInstructor } from '../controllers/instructor.js';
import { authMiddleware } from "../middlewares/authMiddleWare.js";
import { tenantContextMiddleware } from "../middlewares/tenantContextMiddleWare.js";

const router = express.Router();

router.post("/register_staff",authMiddleware,tenantContextMiddleware,registerInstructor)


export default router;