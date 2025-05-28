import express from 'express';
import { fetchAllStudent, fetchStudent, registerStudent } from '../controllers/student.js';

const router = express.Router();


router.post("/add_student",registerStudent)
router.get("/fetch_student",fetchAllStudent)
router.get("/search_studet",fetchStudent)

export default router;