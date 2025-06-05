import Joi from "joi";

export const paymentSchema = Joi.object({
  paidBy: Joi.string().min(3).required().messages({
    "string.empty": "PaidBy is required",
  }),
  paymentMethod: Joi.string()
    .required()
    .messages({ "string.empty": "Payment method is required" }),
  phoneNumber: Joi.string()
    .pattern(/^\+?[0-9]{7,14}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Phone number must be valid and contain only digits",
    }),
  amountPaid: Joi.string()
    .required()
    .messages({ "string.empty": "Amount Paid is required" }),
});
