import express from "express";
import { allGeneratedTimes, createBookings, generateSchedule } from "../controllers/scheduleController.js";

const router = express.Router();


router.post("/generate",generateSchedule)
router.get("/generated_slots",allGeneratedTimes)
router.post("/allocate_slot",createBookings)

export default router;