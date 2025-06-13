import logger from "../config/logger.js";
import { createInstructor, findInstructorByEmail } from "../services/instructor.js";
import { instructorSchema } from "../validations/instructor.js";

export const registerInstructor = async (req, res) => {
  try {
    const { error, value } = instructorSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const existingInstructor = await findInstructorByEmail(value.email); // adjust if it's an instructor lookup
    if (existingInstructor) {
      return res.status(400).json({
        msg: "An account is registered with this email",
      });
    }
    const result = await createInstructor(value);
    if (!result.success) {
      return res.status(400).json({
        msg: result.msg || "Failed to register instructor",
      });
    }
    return res.status(201).json({
      msg: result.msg,
      data: result.data,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};
