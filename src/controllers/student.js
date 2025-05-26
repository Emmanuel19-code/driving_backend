import {
  allStudents,
  createStudent,
  findStudentByEmail,
  getStudent,
} from "../services/student";

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
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const fetchStudent = async (req, res) => {
  try {
    const { studentId } = req.body;
    const student = await getStudent(studentId);
  } catch (error) {
    res.status(500).json({error:'Internal server error'})
  }
};

export const fetchAllStudent = async (req,res) =>{
  try {
    const student = await allStudents();
  } catch (error) {
    res.status(500).json({error:'Internal Server error'})
  }
}
