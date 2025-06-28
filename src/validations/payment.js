import Joi from "joi";

export const paymentSchema = Joi.object({
  studentId: Joi.string().min(3).required().messages({
    "string.empty": "Student is required",
  }),

  paymentMethod: Joi.string().valid("cash", "mobile_money").required().messages({
    "any.only": "Payment method must be either Cash or Mobile Money",
    "string.empty": "Payment method is required",
  }),

  phoneNumber: Joi.string()
    .pattern(/^\+?[0-9]{7,14}$/)
    .required()
    .messages({
      "string.empty": "Phone number is required",
      "string.pattern.base": "Phone number must be valid and contain only digits",
    }),

  amountPaid: Joi.number().positive().required().messages({
    "number.base": "Amount paid must be a number",
    "number.positive": "Amount paid must be greater than 0",
    "any.required": "Amount paid is required",
  }),

  reason: Joi.string().valid("service_payment", "license_fee", "other").required().messages({
    "any.only": "Invalid reason type",
    "string.empty": "Reason is required",
  }),

  otherReasonText: Joi.when("reason", {
    is: "other",
    then: Joi.string().min(3).required().messages({
      "string.empty": "Please specify a reason",
    }),
    otherwise: Joi.optional(),
  }),
});
