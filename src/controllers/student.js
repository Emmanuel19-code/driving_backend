import logger from "../config/logger.js";
import {
  allStudents,
  createStudent,
  findStudentByEmail,
  getStudent,
  searchStudent,
} from "../services/student.js";
import { studentSchema } from "../validations/student.js";

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
    if(!student)
    {
      return res.status(409).json({msg:"Student Could not be added"})
    }
    res.status(201).json({msg:"Student Created"})
  } catch (error) {
    logger.error(error)
    res.status(500).json({ error: "Internal server error" });
  }
};

export const fetchStudent = async (req, res) => {
  try {
    const name = req.query.name;
    const student = await searchStudent();
  } catch (error) {
    logger.error(error)
    res.status(500).json({error:'Internal server error'})
  }
};

export const fetchAllStudent = async (req,res) =>{
  try {
    const student = await allStudents();
    res.status(200).json({data:student})
  } catch (error) {
    logger.error(error)
    res.status(500).json({error:'Internal Server error'})
  }
}
