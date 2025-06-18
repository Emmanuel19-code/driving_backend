import logger from "../config/logger.js";
import {
  allStudents,
  countStudents,
  createStudent,
  fetchCompletedStudents,
  findStudentByEmail,
  getStudent,
  getStudentsScheduledForTomorrow,
  searchStudent,
} from "../services/student.js";
import { studentSchema } from "../validations/student.js";


//registering a student
export const registerStudent = async (req, res) => {
  try {
    const { error, value } = studentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const existingStudent = await findStudentByEmail(value.email);
    if (existingStudent) {
      return res.status(400).json({
        msg: "An account is registered with this email",
      });
    }
    
    const student = await createStudent(value);
    console.log(student);
    
    if (!student.success) {
      return res.status(409).json({ msg: student.error });
    }
    res.status(201).json({ msg: "Student Created" });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//searching for a student
export const fetchStudent = async (req, res) => {
  try {
    const name = req.query.name;
    const student = await searchStudent();
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//getting all students
export const fetchAllStudent = async (req, res) => {
  try {
    const student = await allStudents();
    res.status(200).json({ data: student });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Internal Server error" });
  }
};

//getting the total number of registered students in a year
export const studentPopulationByYear = async (req,res) =>{
 try {
   const result = await countStudents();
   if(!result.success)
   {
     return res.status(409).json(result.msg)
   }
   return res.status(200).json(result.msg)
 } catch (error) {
  logger.error(error);
  res.status(500).json({ error: "Internal Server error" });
 }
}

//getting students for the nextday practical session
export const fetchTheNextDayStudentScheduled = async (req, res) => {
  try {
    const result = await getStudentsScheduledForTomorrow();
    if (!result.success) {
      return res.status(500).json({ success: false, error: result.error });
    }
    return res.status(200).json({ success: true, data: result.data });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Server error" });
  }
};


//getting students who have completed their theory class
export const getStudentsCompletedTheoryClass = async (req, res) => {
  try {
    const result = await fetchCompletedStudents();
    if (!result.success) {
      return res.status(500).json({ success: false, error: result.error });
    }
    return res.status(200).json({ success: true, data: result.data });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || "An unexpected error occurred while fetching students.",
    });
  }
};