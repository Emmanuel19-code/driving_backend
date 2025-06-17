import express from 'express';
import { fetchAllStudent, fetchStudent, registerStudent, studentPopulationByYear } from '../controllers/student.js';

const router = express.Router();


router.post("/add_student",registerStudent)
router.get("/fetch_student",fetchAllStudent)
router.get("/search_studet",fetchStudent)
router.get("/students_numbers",studentPopulationByYear)

export default router;