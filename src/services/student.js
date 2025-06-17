import logger from "../config/logger.js";
import {studentModel,studentIdCounter, serviceModels, registeredSelectedService} from "../models/index.js"


export const findStudentByEmail = async (email) => {
  return await studentModel.findOne({ where: { email } });
};

export const createStudent = async (value) => {
  try {
    const service = await serviceModels.findOne({
      where: { serviceId: value.serviceId },
    });
    if (!service) {
      return {
        success: false,
        error: "This service has not been approved",
      };
    }
    const amountOwing = service.fee;
    const student = await studentModel.create({
      ...value,
      amountOwing,
    });
    if(!student)
    {
       return {
         success:false,
         msg:"Could not add student try again"
       }
    }
    const attachChosenService = await registeredSelectedService.create({
      studentId: student.studentId,
      serviceTypeId: service.serviceId,
      totalDurationForService: service.totalDuration,
      noOfDaysInClass: service.noOfDaysInClass,
      noOfPracticalHours: service.noOfPracticalHours,
    });
    if(!attachChosenService)
    {
       return {
         success:false,
         msg:"could not register service for student try again"
       }
    }
    return {
       success:true,
       msg:"all registration process done"
    }
  } catch (error) {
    logger.error(error)
    return {
      success: false,
      msg: error.message || "Failed to generate time slots.",
    };
  }
};

export const getStudent = async (studentId) =>{
   return await studentModel.findOne({where:{studentId}})
}

export const allStudents = async () =>{
    return await studentModel.findAll();
}

export const countStudents = async()=>{
  try {
    const data = await studentIdCounter.findAll();
    if(!data)
    {
      return {
         success:false,
         msg:"Could not fetch data"
      }
    }
    return {
       success:true,
       msg:data
    }
  } catch (error) {
    return {
      success: false,
      msg: error.message || "Failed to generate time slots.",
    };
  }
 
}

export const searchStudent = async ()=>{
  
}