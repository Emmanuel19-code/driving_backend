import Joi from "joi";

export const instructorSchema = Joi.object({
  fullName: Joi.string().min(3).required().messages({
    "string.empty": "Full name is required",
    "string.min": "Full name must be at least 3 characters",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be a valid email address",
  }),
  phoneOne: Joi.string()
    .min(10)
    .pattern(/^\+?[0-9]{7,14}$/)
    .required()
    .messages({
      "string.empty": "Primary phone number is required",
      "string.min": "Phone number must be at least 10 digits",
      "string.pattern.base":
        "Phone number must be valid and contain only digits",
    }),
  phoneTwo: Joi.string()
    .min(10)
    .pattern(/^\+?[0-9]{7,14}$/)
    .messages({
      "string.min": "Phone number must be at least 10 digits",
      "string.pattern.base":
        "Phone number must be valid and contain only digits",
    }),
  Role: Joi.string().required().messages({
    "string.empty": "Role is required",
  }),
});
