import express from "express";
import { allGeneratedTimes, createBookings, fetchAllBookedSlots, generateSchedule } from "../controllers/scheduleController.js";

const router = express.Router();


router.post("/generate",generateSchedule)
router.get("/generated_slots",allGeneratedTimes)
router.post("/allocate_slot",createBookings)
router.get("/all_bookings",fetchAllBookedSlots)

export default router;