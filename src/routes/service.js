import express from "express"
import { deleteRegisteredService, getRegisteredService, registerService } from "../controllers/serviceOffered.js";

const router = express.Router();


router.post("/add_newService",registerService)
router.get("/getAllServices",getRegisteredService)
router.delete("/delete_service:serviceId",deleteRegisteredService)

export default router;