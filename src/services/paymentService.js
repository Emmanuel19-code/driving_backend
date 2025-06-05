import { paymentModel, studentModel } from "../models/index.js";

export const completingPayment = async (value) => {
  const { phoneNumber, amountPaid, paidBy, paymentMethod } = value;
  const student = await studentModel.findOne({ where: { studentId: paidBy } });
  if (!student) {
    throw new Error("Student not found");
  }
  const owedAmount = Number(student.amountOwing); 
  const paidAmount = Number(amountPaid);
  if (owedAmount === 0) {
    throw new Error("No payment required");
  }
  if (paidAmount <= 0) {
    throw new Error("Invalid payment amount");
  }
  const actualPayment = Math.min(paidAmount, owedAmount);
  const newAmountOwed = owedAmount - actualPayment;
  await paymentModel.create({
    paidBy,
    phoneNumber,
    paymentMethod,
    amountPaid: actualPayment,
  });
  student.amountOwing = newAmountOwed;
  await student.save();
  return {
    msg: "Payment completed",
    amountPaid: actualPayment.toFixed(2),
    remainingOwed: newAmountOwed.toFixed(2),
  };
};
