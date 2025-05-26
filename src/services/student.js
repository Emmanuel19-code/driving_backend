import Student from "../models/student.js";


export const findStudentByEmail = async (email) => {
  return await Student.findOne({ where: { email } });
};

export const createStudent = async (studentData) => {
  return await Student.create(studentData);
};

export const getStudent = async (studentId) =>{
   return await Student.findOne({where:{studentId}})
}

export const allStudents = async () =>{
    return await Student.findAll();
}