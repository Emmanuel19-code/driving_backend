import logger from "../config/logger.js";
import {
  allStudents,
  countStudents,
  createStudent,
  fetchCompletedStudents,
  findStudentByEmail,
  getStudentsNotStartedPracticalService,
  getStudentsScheduledForTomorrow,
 // searchStudent,
} from "../services/student.js";
import { studentSchema } from "../validations/student.js";

// Register a new student
export const registerStudent = async (req, res) => {
  try {
    const { error, value } = studentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { models } = req.tenantContext;

    const existingStudent = await findStudentByEmail(value.email, models);
    if (existingStudent) {
      return res.status(400).json({
        msg: "An account is registered with this email",
      });
    }

    const student = await createStudent(value, models);
    if (!student.success) {
      return res.status(409).json({ msg: student.error || student.msg });
    }

    res.status(201).json({ msg: "Student Created" });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all students
export const fetchAllStudent = async (req, res) => {
  try {
    const { models } = req.tenantContext;
    const students = await allStudents(models);
    res.status(200).json({ data: students });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Internal Server error" });
  }
};

// Count total students per year
export const studentPopulationByYear = async (req, res) => {
  try {
    const { models } = req.tenantContext;
    const result = await countStudents(models);
    if (!result.success) {
      return res.status(409).json(result.msg);
    }
    return res.status(200).json(result.msg);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Internal Server error" });
  }
};

// Fetch students scheduled for tomorrow's practical
export const fetchTheNextDayStudentScheduled = async (req, res) => {
  try {
    const { models } = req.tenantContext;
    const result = await getStudentsScheduledForTomorrow(models);
    if (!result.success) {
      return res.status(500).json({ success: false, error: result.error });
    }
    return res.status(200).json({ success: true, data: result.data });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// Fetch students who have completed theory class
export const getStudentsCompletedTheoryClass = async (req, res) => {
  try {
    const { models } = req.tenantContext;
    const result = await fetchCompletedStudents(models);
    if (!result.success) {
      return res.status(500).json({ success: false, error: result.error });
    }
    return res.status(200).json({ success: true, data: result.data });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      success: false,
      error: error.message || "An unexpected error occurred.",
    });
  }
};

// Search student (optional: implement logic inside `searchStudent`)
export const fetchStudent = async (req, res) => {
  try {
    const name = req.query.name;
    const { models } = req.tenantContext;

    //const result = await searchStudent(name, models); // Implement this in service
    res.status(200).json({ data: result });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//getting students who have not started their practicals
export const getStudentsNotStartedPracticalController = async (req, res) => {
  const result = await getStudentsNotStartedPracticalService();
  if (!result.success) {
    return res.status(500).json({
      success: false,
      error: result.error,
    });
  }
  return res.status(200).json({
    success: true,
    data: result.data,
  });
};