import express from "express"
import { fetchAllPaymentsReceived, getTotalPaymentThisYear, makePayment} from "../controllers/paymentController.js";
import { authMiddleware } from "../middlewares/authMiddleWare.js";
import { tenantContextMiddleware } from "../middlewares/tenantContextMiddleWare.js";

const router = express.Router();

router.post("/make_payment",authMiddleware,tenantContextMiddleware,makePayment)
router.get("/payments_received",authMiddleware,tenantContextMiddleware,fetchAllPaymentsReceived)
router.get("/total_payment_this_year",authMiddleware,tenantContextMiddleware,getTotalPaymentThisYear);

export default router;