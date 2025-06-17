import Joi from "joi";

export const serviceValidate = Joi.object({
  serviceType: Joi.string().required().messages({
    "string.empty": "Field Cannot be empty",
  }),
  fee: Joi.string().required().messages({
    "string.empty": "Field Cannot be empty",
  }),
  serviceDescription: Joi.string().required().messages({
    "string.empty": "Field Cannot be emtpy",
  }),
  totalDuration: Joi.string().required().messages({
    "string.empty": "Field Cannot be empty",
  }),
  noOfDaysInClass: Joi.string().required().messages({
    "string.empty": "provide number of days",
  }),
  noOfPracticalHours: Joi.number()
  .min(1)
  .required()
  .messages({
    "number.base": "Number of hours must be a valid number",
    "number.min": "Number of hours must be greater than 0",
    "any.required": "Provide number of hours",
  }),
  noOfTimesWeekly:Joi.number().min(1).required().messages({
    "number.base": "Number of hours must be a valid number",
    "number.min": "Number of hours must be greater than 0",
    "any.required": "Provide number of times in a week",
  }),
  allowedDays:Joi.string().required().messages({
    "string.empty":"provide days for this service"
  })
});