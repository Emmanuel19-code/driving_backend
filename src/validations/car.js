import Joi from "joi";


export const carValidate = Joi.object({
  carModel: Joi.string().required().messages({
    "string.empty": "Full name is required",
  }),
  carColour: Joi.string().required().messages({
    "string.empty": "Last name is required",
  }),
  carRegistrationNumber: Joi.string().required().messages({
    "string.empty": "Please enter carRegistrationNumber",
  }),
  carTransmissionType: Joi.string().required().messages({
    msg: "Provide transmission type",
  }),
  carRoadWorthyExpiry: Joi.string().allow(" ").optional(),
  carInsuaranceExpiry: Joi.string().allow(" ").optional(),
});


export const fuelRechargeValidate = Joi.object({
  carRegistrationNumber: Joi.string().required().messages({
    "string.empty": "car Id must be provided",
  }),
  amountloaded: Joi.number().required().greater(0).messages({
    "any.required": "amount loaded must be entered",
    "number.base": "amount loaded must be a number",
    "number.greater": "amount loaded must be greater than zero",
  }),
  refilledBy: Joi.string().required().messages({
    "string.empty": "Provide name of person",
  }),
  litres: Joi.number().required().greater(0).messages({
    "any.required": "litres must be entered",
    "number.base": "litres must be a number",
    "number.greater": "litres must be greater than zero",
  }),
});


export const carDocumentValidate = Joi.object({
  carRegistrationNumber: Joi.string().trim().required().messages({
    "string.base": "Car registration number must be a string",
    "string.empty": "Car registration number is required",
  }),

  documentType: Joi.string().trim().required().messages({
    "string.base": "Document type must be a string",
    "string.empty": "Document type is required",
  }),

  expiryDate: Joi.date().greater("now").required().messages({
    "date.base": "Expiry date must be a valid date",
    "date.greater": "Expiry date must be a future date",
    "any.required": "Expiry date is required",
  }),
});
