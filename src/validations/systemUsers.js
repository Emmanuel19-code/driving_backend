import Joi from "joi";

export const createTenantSchema = Joi.object({
  name: Joi.string().min(3).required().messages({
    "string.empty": "Company name is required",
    "string.min": "Company name must be at least 3 characters",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be valid",
  }),
  password: Joi.string().min(6).optional().messages({
    "string.min": "Password must be at least 6 characters",
  }),
  dbDialect: Joi.string()
    .valid("mysql", "postgres", "mssql")
    .optional()
    .default("mysql")
    .messages({
      "any.only": "Dialect must be one of mysql, postgres, or mssql",
    }),
});
