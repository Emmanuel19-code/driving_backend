import express from "express"
import { deleteRegisteredService, getRegisteredService, registerService } from "../controllers/serviceOffered.js";
import { authMiddleware } from "../middlewares/authMiddleWare.js";
import { tenantContextMiddleware } from "../middlewares/tenantContextMiddleWare.js";

const router = express.Router();


router.post("/add_newService",authMiddleware,tenantContextMiddleware,registerService)
router.get("/getAllServices",authMiddleware,tenantContextMiddleware,getRegisteredService)
router.delete("/delete_service:serviceId",authMiddleware,tenantContextMiddleware,deleteRegisteredService)

export default router;