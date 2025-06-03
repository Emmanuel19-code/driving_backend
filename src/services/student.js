import {studentModel,studentIdCounter} from "../models/index.js"


export const findStudentByEmail = async (email) => {
  return await studentModel.findOne({ where: { email } });
};

export const createStudent = async (studentData) => {
  return await studentModel.create(studentData);
};

export const getStudent = async (studentId) =>{
   return await studentModel.findOne({where:{studentId}})
}

export const allStudents = async () =>{
    return await studentModel.findAll();
}

export const countStudents = async()=>{
  return await studentIdCounter.findAll()
}

export const searchStudent = async ()=>{
  
}