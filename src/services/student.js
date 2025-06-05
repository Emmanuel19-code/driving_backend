import {studentModel,studentIdCounter, serviceModels} from "../models/index.js"


export const findStudentByEmail = async (email) => {
  return await studentModel.findOne({ where: { email } });
};

export const createStudent = async (studentData,service) => {
  const amountOwing = service.fee.toString();
  const serviceType = service.serviceType
  return await studentModel.create({...studentData,amountOwing,serviceType});
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