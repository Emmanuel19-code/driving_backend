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
  carId: Joi.string().required().messages({
    "string.empty": "car Id must be provided",
  }),
  amountloaded:Joi.string().required().messages({
    "string.empty":"amount loaded must be entererd"
  })
});
