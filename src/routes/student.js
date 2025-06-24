import express from "express";
import {
  fetchAllStudent,
  fetchStudent,
  fetchStudentIdsAndNames,
  getStudentsCompletedTheoryClass,
  getStudentsNotStartedPracticalController,
  registerStudent,
  studentPopulationByYear,
} from "../controllers/student.js";
import {
  createBookings,
  markAttendance,
} from "../controllers/scheduleController.js";
import { authMiddleware } from "../middlewares/authMiddleWare.js";
import { tenantContextMiddleware } from "../middlewares/tenantContextMiddleWare.js";

const router = express.Router();

router.post("/add_student",authMiddleware,tenantContextMiddleware,registerStudent);
router.get("/fetch_student",authMiddleware,tenantContextMiddleware, fetchAllStudent);
router.get("/search_studet", authMiddleware,tenantContextMiddleware,fetchStudent);
router.get("/population_info", authMiddleware,tenantContextMiddleware,studentPopulationByYear);
router.post("/assign_pick_periods", authMiddleware,tenantContextMiddleware,createBookings);
router.put("/mark_attendance/:studentId", authMiddleware,tenantContextMiddleware,markAttendance);
router.get("/completed_theory_class",authMiddleware,tenantContextMiddleware ,getStudentsCompletedTheoryClass);
router.get("/students/practical-not-started",authMiddleware,tenantContextMiddleware,getStudentsNotStartedPracticalController)
router.get("/student_names_studentId_only",authMiddleware,tenantContextMiddleware,fetchStudentIdsAndNames)

export default router;
