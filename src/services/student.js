import logger from "../config/logger.js";
import {studentModel,studentIdCounter, serviceModels, registeredSelectedService, timeSlots} from "../models/index.js"


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

    // ✅ The model hook will auto-generate studentId and update gender count
    const student = await studentModel.create({
      ...value,
      amountOwing,
    });

    if (!student) {
      return {
        success: false,
        msg: "Could not add student. Try again.",
      };
    }

    const attachChosenService = await registeredSelectedService.create({
      studentId: student.studentId,
      serviceTypeId: service.serviceId,
      totalDurationForService: service.totalDuration,
      noOfDaysInClass: service.noOfDaysInClass,
      noOfPracticalHours: service.noOfPracticalHours,
      noOfTimesWeekly:service.noOfTimesWeekly
    });

    if (!attachChosenService) {
      return {
        success: false,
        msg: "Could not register service for student. Try again.",
      };
    }

    return {
      success: true,
      msg: "All registration processes completed successfully.",
    };
  } catch (error) {
    logger.error(error);
    return {
      success: false,
      msg: error.message || "Failed to register student.",
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


//getting students scheduled for the following day practicals
export const getStudentsScheduledForTomorrow = async () => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayOfWeek = tomorrow.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
    // Step 1: Get all time slots for tomorrow
    const tomorrowSlots = await timeSlots.findAll({
      where: { day: { [Op.eq]: dayOfWeek } },
    });
    const slotIds = tomorrowSlots.map(slot => slot.timeSlotId);
    if (!slotIds.length) return { success: true, data: [] };
    // Step 2: Get all bookings for those time slots
    const tomorrowBookings = await bookings.findAll({
      where: { timeSlotId: { [Op.in]: slotIds } },
      include: [{ model: studentModel }],
    });
    return {
      success: true,
      data: tomorrowBookings,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to fetch tomorrow's bookings",
    };
  }
};