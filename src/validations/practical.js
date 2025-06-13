import Joi from "joi";



export const bookingSchema = Joi.object({
  timeSlotIds: Joi.array()
    .items(Joi.string().required())
    .min(1)
    .required()
    .messages({
      "array.min": "At least one timeSlotId is required.",
      "any.required": "timeSlotIds is required.",
    }),
  studentId: Joi.string().required(),
  driverId: Joi.string().required(),
});
