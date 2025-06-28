import { Op, fn, col } from "sequelize";
import logger from "../config/logger.js";

export const completingPayment = async (tenantContext, value) => {
  try {
    const {
      studentId,
      phoneNumber,
      amountPaid,
      paymentMethod,
      reason,
      otherReasonText,
    } = value;

    const { paymentModel, studentModel } = tenantContext.models;

    // 1. Find student
    const student = await studentModel.findOne({ where: { studentId } });
    if (!student) {
      return { success: false, error: "Student not found" };
    }

    // 2. Parse amounts safely
    const paidAmount = parseFloat(amountPaid);
    let actualPayment = paidAmount;
    let remainingOwed = parseFloat(student.amountOwing || 0);

    // 3. Adjust amountOwing only for service payments
    if (reason === "service_payment") {
      const owedAmount = parseFloat(student.amountOwing || 0);
      if (owedAmount <= 0) {
        return { success: false, error: "No payment required for services" };
      }

      actualPayment = Math.min(paidAmount, owedAmount);
      remainingOwed = owedAmount - actualPayment;
      student.amountOwing = remainingOwed;
    }

    // 4. Always increase total amountPaid
    const currentPaid = parseFloat(student.amountPaid || 0);
    student.amountPaid = currentPaid + actualPayment;

    // 5. Create payment record
    await paymentModel.create({
      paidBy: student.studentId,
      phoneNumber,
      paymentMethod,
      amountPaid: actualPayment,
      reason: reason === "other" ? otherReasonText : reason,
    });

    // 6. Save student changes
    await student.save();

    // 7. Response
    return {
      success: true,
      msg: "Payment recorded successfully",
      amountPaid: actualPayment.toFixed(2),
      totalPaid: student.amountPaid.toFixed(2),
      remainingOwed: student.amountOwing.toFixed(2),
    };
  } catch (err) {
    logger.error("Payment error:", err);
    return {
      success: false,
      error: err.message || "An unexpected error occurred",
    };
  }
};


export const getAllMoneyReceived = async (tenantContext) => {
  try {
    const { paymentModel, studentModel } = tenantContext.models;

    const payments = await paymentModel.findAll({
      include: [
        {
          model: studentModel,
          as: "student",
          attributes: ["firstName", "lastName","otherName"],
          required: false, // if student might have been deleted
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Format response to include fullName
    const result = payments.map((payment) => {
      const student = payment.student;
      const studentName = student
        ? `${student.firstName} ${student.lastName} ${student.otherName}`
        : "Unknown";

      return {
        id: payment.id,
        paymentId: payment.paymentId,
        studentName, // ✅ Real name
        phoneNumber: payment.phoneNumber,
        paymentMethod: payment.paymentMethod,
        amountPaid: payment.amountPaid,
        reason: payment.reason,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
      };
    });

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    logger.error("Error fetching payments:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch payments",
    };
  }
};



export const getTotalPaymentsCurrentYear = async (tenantContext) => {
  try {
    const { paymentModel } = tenantContext.models;
    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear, 0, 1);
    const endDate = new Date(currentYear, 11, 31, 23, 59, 59);

    const result = await paymentModel.findOne({
      attributes: [[fn("SUM", col("amountPaid")), "totalAmount"]],
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
      raw: true,
    });
    return {
      success: true,
      data: result.totalAmount || 0,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to fetch total payments for current year.",
    };
  }
};




