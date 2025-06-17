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
  noOfPracticalHours: Joi.string().required().messages({
    "string.empty": "provide number of hours",
  }),
  allowedDays:Joi.string().required().messages({
    "string.empty":"provide days for this service"
  })
});