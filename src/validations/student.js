import Joi from "joi";

export const studentSchema = Joi.object({
  firstName: Joi.string().min(3).required().messages({
    'string.empty': 'Full name is required',
    'string.min': 'Full name must be at least 3 characters',
  }),
  lastName: Joi.string().min(3).required().messages({
    'string.empty': 'Last name is required',
    'string.min': 'Last name must be at least 3 characters',
  }),
  otherName:Joi.string(),
  gender:Joi.string().required().messages({'string.empty':"Gender must be provided"}),
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
  phoneTwo: Joi.string().allow('').optional(),
  serviceType: Joi.string()
  .required()
  .messages({'string.empty':'service Type required'})
});