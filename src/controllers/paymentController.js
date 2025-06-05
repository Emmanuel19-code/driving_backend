import logger from "../config/logger.js";
import { completingPayment } from "../services/paymentService.js";
import { paymentSchema } from "../validations/payment.js";

export const makePayment = async (req, res) => {
  try {
    const { error, value } = paymentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const result = await completingPayment(value);
    res.status(200).json(result);
  } catch (error) {
    logger.error(error);
    return res.status(400).json({
      msg: error.message || "Internal server error"
    });
  }
};

