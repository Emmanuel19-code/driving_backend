import express from "express";
import { allGeneratedTimes, createBookings, fetchAllBookedSlots, generateSchedule } from "../controllers/scheduleController.js";
import { authMiddleware } from "../middlewares/authMiddleWare.js";
import { tenantContextMiddleware } from "../middlewares/tenantContextMiddleWare.js";

const router = express.Router();


router.post("/generate",authMiddleware,tenantContextMiddleware,generateSchedule)
router.get("/generated_slots",authMiddleware,tenantContextMiddleware,allGeneratedTimes)
router.post("/allocate_slot",authMiddleware,tenantContextMiddleware,createBookings)
router.get("/all_bookings",authMiddleware,tenantContextMiddleware,fetchAllBookedSlots)

export default router;