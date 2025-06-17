import express from 'express';
import { fetchAllStudent, fetchStudent, registerStudent, studentPopulationByYear } from '../controllers/student.js';
import { createBookings, markAttendance } from '../controllers/scheduleController.js';

const router = express.Router();


router.post("/add_student",registerStudent)
router.get("/fetch_student",fetchAllStudent)
router.get("/search_studet",fetchStudent)
router.get("/population_info",studentPopulationByYear)
router.post("/assign_pick_periods",createBookings)
router.put("/mark_attendance/:studentId",markAttendance)

export default router;