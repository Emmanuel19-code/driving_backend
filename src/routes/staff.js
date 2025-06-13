import express from 'express'
import { registerInstructor } from '../controllers/instructor.js';


const router = express.Router();

router.post("/register_staff",registerInstructor)


export default router;