import logger from "../config/logger.js";
import { completingPayment, getAllMoneyReceived, getAmountYetToBeReceived, getTotalPaymentsCurrentYear } from "../services/paymentService.js";
import { paymentSchema } from "../validations/payment.js";

export const makePayment = async (req, res) => {
  try {
    const { error, value } = paymentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message,
      });
    }
    const result = await completingPayment(req.tenantContext, value);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error,
      });
    }
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
};


export const fetchAllPaymentsReceived = async (req, res) => {
  try {
    const result = await getAllMoneyReceived(req.tenantContext);

    if (!result.success) {
      return res.status(400).json({ success: false, error: result.error });
    }
    return res.status(200).json({ success: true, data: result.data });
  } catch (error) {
    logger.error("Fetch All Payments Error:", error);
    return res.status(500).json({
      success: false,
      error: "An unexpected error occurred while retrieving payments",
    });
  }
};


export const getTotalPaymentThisYear = async (req,res) =>{
try {
    const tenantContext = req.tenantContext;
    const result = await getTotalPaymentsCurrentYear(tenantContext);
    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: result.error,
      });
    }
    return res.status(200).json({
      success: true,
      totalReceived: result.data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
}


export const getAmountYetToBeReceivedController = async (req, res) => {
  const tenantContext = req.tenantContext;
  const response = await getAmountYetToBeReceived(tenantContext);
  if (!response.success) {
    return res.status(500).json({ success: false, error: response.error });
  }
  return res.status(200).json({ success: true, data: response.data });
};