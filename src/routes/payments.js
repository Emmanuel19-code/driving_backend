import express from "express"
import { makePayment } from "../controllers/paymentController.js";
import { authMiddleware } from "../middlewares/authMiddleWare.js";
import { tenantContextMiddleware } from "../middlewares/tenantContextMiddleWare.js";

const router = express.Router();

router.post("/make_payment",authMiddleware,tenantContextMiddleware,makePayment)



export default router;