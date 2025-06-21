import express from "express";
import {
  fetchAllStudent,
  fetchStudent,
  getStudentsCompletedTheoryClass,
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
router.get("/fetch_student", fetchAllStudent);
router.get("/search_studet", fetchStudent);
router.get("/population_info", studentPopulationByYear);
router.post("/assign_pick_periods", createBookings);
router.put("/mark_attendance/:studentId", markAttendance);
router.get("/completed_theory_class", getStudentsCompletedTheoryClass);

export default router;
