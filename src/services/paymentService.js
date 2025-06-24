export const completingPayment = async (tenantContext, value) => {
  const { phoneNumber, amountPaid, paidBy, paymentMethod } = value;
  const { paymentModel, studentModel } = tenantContext.models;

  // 1. Find student
  const student = await studentModel.findOne({ where: { studentId: paidBy } });
  if (!student) {
    throw new Error("Student not found");
  }

  const owedAmount = Number(student.amountOwing); 
  const paidAmount = Number(amountPaid);

  // 2. Validate payment
  if (owedAmount === 0) {
    throw new Error("No payment required");
  }
  if (paidAmount <= 0) {
    throw new Error("Invalid payment amount");
  }

  // 3. Calculate actual payment to apply
  const actualPayment = Math.min(paidAmount, owedAmount);
  const newAmountOwed = owedAmount - actualPayment;

  // 4. Create payment record
  await paymentModel.create({
    paidBy,
    phoneNumber,
    paymentMethod,
    amountPaid: actualPayment,
  });
  // 5. Update student’s remaining balance
  student.amountOwing = newAmountOwed;
  await student.save();
  return {
    msg: "Payment completed",
    amountPaid: actualPayment.toFixed(2),
    remainingOwed: newAmountOwed.toFixed(2),
  };
};

