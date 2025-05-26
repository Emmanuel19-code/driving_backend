import express from 'express';
import { fetchStudent, registerStudent } from '../controllers/student';

const router = express.Router();


router.post("/add_student",registerStudent)
router.get("/find_student",fetchStudent)

export default router;