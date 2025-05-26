import Joi from "joi";

export const studentSchema = Joi.object({
  fullName: Joi.string().min(3).required().messages({
    'string.empty': 'Full name is required',
    'string.min': 'Full name must be at least 3 characters',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email address',
    'string.empty': 'Email is required',
  }),
  phoneOne: Joi.string()
    .pattern(/^\+?[0-9]{7,14}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must be valid and contain only digits',
    }),
  phoneTwo:Joi.string()
   .pattern(/^\+?[0-9]{7,14}$/)
   .message({
      'string.pattern.base':'Phone number must be valid and contain only digits'
   })
});