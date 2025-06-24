import logger from "../config/logger.js";
import { completingPayment } from "../services/paymentService.js";
import { paymentSchema } from "../validations/payment.js";

export const makePayment = async (req, res) => {
  try {
    const { error, value } = paymentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, error: error.details[0].message });
    }
    const result = await completingPayment(req.tenantContext, value);
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error(error);
    return res.status(400).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
};
