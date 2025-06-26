import { Op } from "sequelize";
import logger from "../config/logger.js";

// Find student by email
export const findStudentByEmail = async (email, models) => {
  const { studentModel } = models;
  return await studentModel.findOne({ where: { email } });
};

// Add new student
export const createStudent = async (value, models) => {
  try {
    const {
      studentModel,
      serviceModels,
      studentChosenService,
      studentIdCounter
    } = models;

    const service = await serviceModels.findOne({
      where: { serviceId: value.serviceId },
    });

    if (!service) {
      return {
        success: false,
        error: "The selected service for the student has not been approved",
      };
    }

    const amountOwing = service.fee;

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

    const attachChosenService = await studentChosenService.create({
      studentId: student.studentId,
      serviceTypeId: service.serviceId,
      totalDurationForService: service.totalDuration,
      noOfDaysInClass: service.noOfDaysInClass,
      noOfPracticalHours: service.noOfPracticalHours,
      noOfTimesWeekly: service.noOfTimesWeekly,
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

// Get single student
export const getStudent = async (studentId, models) => {
  return await models.studentModel.findOne({ where: { studentId } });
};

// Get all students
export const allStudents = async (models) => {
  try {
    const students = await models.studentModel.findAll({
      include: [
        {
          model: models.studentChosenService,
          as: "chosenServices",
          attributes: [
            "serviceTypeId",
            "startedClass", 
          ],
          include: [
            {
              model: models.serviceModels,
              as: "serviceInfo",
              attributes: ["serviceType"], 
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    return { success: true, data: students };
  } catch (error) {
    console.error("Error fetching students:", error.message);
    return { success: false, error: "Failed to fetch students." };
  }
};



// Count all registered students
export const countStudents = async (models) => {
  try {
    const data = await models.studentIdCounter.findAll();
    if (!data) {
      return {
        success: false,
        msg: "Could not fetch data",
      };
    }
    return {
      success: true,
      msg: data,
    };
  } catch (error) {
    return {
      success: false,
      msg: error.message || "Failed to count students.",
    };
  }
};

// Get students scheduled for tomorrow
export const getStudentsScheduledForTomorrow = async (models) => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayOfWeek = tomorrow
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();

    const { timeSlots, bookings, studentModel } = models;

    const tomorrowSlots = await timeSlots.findAll({
      where: { day: { [Op.eq]: dayOfWeek } },
    });

    const slotIds = tomorrowSlots.map((slot) => slot.timeSlotId);
    if (!slotIds.length) return { success: true, data: [] };

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

// Get students who have completed theory
export const fetchCompletedStudents = async (models) => {
  try {
    const { studentChosenService, studentModel } = models;

    const completedStudents = await studentChosenService.findAll({
      where: {
        classCompleted: "true",
        practicalStatus: "not started",
      },
      include: [
        {
          model: studentModel,
          attributes: ["studentId", "firstName", "lastName", "otherName"],
        },
      ],
    });

    const result = completedStudents.map((record) => {
      const student = record.Student;
      return {
        studentId: student?.studentId,
        fullName: `${student?.firstName} ${student?.lastName} ${student?.otherName}`,
      };
    });

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to fetch students who completed class.",
    };
  }
};



//getting students who have not started their practicals
export const getStudentsNotStartedPracticalService = async () => {
  try {
    const { studentModel, studentChosenService } = tenantContext.models;
    const students = await studentModel.findAll({
      include: [
        {
          model: studentChosenService,
          where: {
            classCompleted: "true", // string because your model stores it as STRING
            practicalStatus: "not started",
          },
          attributes: [],
        },
      ],
      attributes: ["studentId", "firstName", "lastName", "email", "phoneOne"],
    });
    return {
      success: true,
      data: students,
    };
  } catch (error) {
    logger.error("Error fetching students who haven't started practicals:", error);
    return {
      success: false,
      error: error.message || "Unable to fetch students",
    };
  }
};
;

//getting students who have started their practical service
export const getStudentsWithPracticalStartedService = async () => {
  try {
    const { studentModel, studentChosenService } = tenantContext.models;
    const students = await studentModel.findAll({
      include: [
        {
          model: studentChosenService,
          where: {
            classCompleted: "true", 
            practicalStatus: "started",
          },
          attributes: [],
        },
      ],
      attributes: ["studentId", "firstName", "lastName", "email", "phoneOne"],
    });
    return {
      success: true,
      data: students,
    };
  } catch (error) {
    logger.error("Error fetching students with 'started' practicals:", error);
    return {
      success: false,
      error: error.message || "Failed to retrieve students",
    };
  }
};


export const getStudentIdsAndNames = async (studentModel) => {
  try {
    const students = await studentModel.findAll({
      attributes: ["studentId", "firstName", "lastName", "otherName"],
      raw: true,
    });
    const formatted = students.map((student) => ({
      studentId: student.studentId,
      fullName: `${student.firstName} ${student.otherName || ""} ${student.lastName}`.trim(),
    }));
    return {
      success: true,
      data: formatted,
    };
  } catch (error) {
    logger.error("Error in getStudentIdsAndNames:", error.message);
    return {
      success: false,
      error: error.message,
    };
  }
};
