import Joi from "joi";

export const instructorSchema = Joi.object({
  fullname: Joi.string().min(3).required().messages({
    "string.empty": "Full name is required",
    "string.min": "Full name must be at least 3 characters",
  }),
  email: Joi.string().required().message({
    "string.empty": "Email is required",
  }),
  phoneOne: Joi.string()
    .min(10)
    .pattern(/^\+?[0-9]{7,14}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Phone number must be valid and contain only digits",
    }),
  phoneTwo: Joi.string()
    .min(10)
    .pattern(/^\+?[0-9]{7,14}$/)
    .messages({
      "string.pattern.base":
        "Phone number must be valid and contain only digits",
    }),
});
