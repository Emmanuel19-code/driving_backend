import express from 'express'
import { registerInstructor } from '../controllers/instructor';


const router = express.Router();

router.post("/register_instructor",registerInstructor)


export default router;