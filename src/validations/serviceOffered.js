import Joi from "joi";

export const serviceValidate = Joi.object({
    serviceType:Joi.string().required().messages({
        'string.empty':"Field Cannot be empty"
    }),
    fee:Joi.string().required().messages({
        'string.empty':"Field Cannot be empty"
    }),
    serviceDescription:Joi.string().required().messages({
        'string.empty':"Field Cannot be emtpy"
    }),
    duration:Joi.string().required().messages({
        'string.empty':"Field Cannot be empty"
    })
})