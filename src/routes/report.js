import express from "express"
import { authMiddleware } from "../middlewares/authMiddleWare.js";
import { tenantContextMiddleware } from "../middlewares/tenantContextMiddleWare.js";
import { getReportsSummary } from "../controllers/reportController.js";

const router = express.Router();

router.get("/report_summary",authMiddleware,tenantContextMiddleware,getReportsSummary)

export default router;