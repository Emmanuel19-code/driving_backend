import { parse, addMinutes, isBefore, format } from "date-fns";
import logger from "../config/logger.js";
import {
  bookings,
  instructorModel,
  registeredSelectedService,
  serviceModels,
  studentModel,
  timeSlots,
} from "../models/index.js";
import { Op } from "sequelize";

//generate the timeslots
export const generateAllTimeSlots = async ({ days, startTime, endTime }) => {
  try {
    const normalizedDays = Array.isArray(days) ? days : [days];
    const createdSlots = [];
    for (const day of normalizedDays) {
      let current = parse(startTime, "HH:mm", new Date());
      const end = parse(endTime, "HH:mm", new Date());
      while (
        isBefore(addMinutes(current, 60), end) ||
        format(current, "HH:mm") === format(end, "HH:mm")
      ) {
        const slotStart = format(current, "HH:mm");
        const slotEnd = format(addMinutes(current, 60), "HH:mm");
        // 🛡️ Check if this slot already exists
        const existing = await timeSlots.findOne({
          where: {
            day,
            startTime: slotStart,
            endTime: slotEnd,
          },
        });

        if (!existing) {
          const slot = await timeSlots.create({
            day,
            startTime: slotStart,
            endTime: slotEnd,
            isBooked: false,
          });
          createdSlots.push(slot);
        }

        current = addMinutes(current, 60);
      }
    }
    return {
      message: `${createdSlots.length} new time slot(s) generated.`,
      slots: createdSlots,
    };
  } catch (error) {
    logger.error("Error generating time slots:", error);
    return {
      success: false,
      error: error.message || "Failed to generate time slots.",
    };
  }
};

//get all the timeslots created
export const getAllTimeSlots = async () => {
  try {
    const slots = await timeSlots.findAll();
    return {
      success: true,
      slots: slots,
    };
  } catch (error) {
    logger.error("Error generating time slots:", error);
    return {
      success: false,
      error: error.message || "Failed to generate time slots.",
    };
  }
};

//creating the bookings
export const practicalPeriodService = async ({
  timeSlotIds,
  studentId,
  driverId,
}) => {
  const createdBookings = [];

  try {
    // Fetch time slots first
    const slots = await timeSlots.findAll({
      where: { timeSlotId: { [Op.in]: timeSlotIds } },
    });

    if (slots.length !== timeSlotIds.length) {
      return {
        success: false,
        error: "One or more time slots are invalid.",
      };
    }

    // Get student chosen service
    const studentService = await registeredSelectedService.findOne({
      where: { studentId },
    });
    if (!studentService)
      return { success: false, error: "Student service not found." };

    const service = await serviceModels.findOne({
      where: { serviceId: studentService.serviceTypeId },
    });
    if (!service) return { success: false, error: "Service not found." };

    const maxWeeklyDays = service.noOfTimesWeekly;
    const maxDailyHours = studentService.noOfPracticalHours;
    const allowedDays =
      studentService.allowedDays
        ?.split(",")
        .map((day) => day.trim().toLowerCase()) || [];

    // Group requested slots by day
    const slotsByDay = {};
    for (const slot of slots) {
      const day = slot.day.toLowerCase();

      // Check if the day is allowed
      if (allowedDays.length && !allowedDays.includes(day)) {
        return {
          success: false,
          error: `Booking not allowed on ${
            day.charAt(0).toUpperCase() + day.slice(1)
          }.`,
        };
      }

      if (!slotsByDay[day]) slotsByDay[day] = [];
      slotsByDay[day].push(slot);
    }

    // Enforce max hours per day
    for (const [day, daySlots] of Object.entries(slotsByDay)) {
      if (daySlots.length > maxDailyHours) {
        return {
          success: false,
          error: `Cannot book more than ${maxDailyHours} hour(s) on ${day}.`,
        };
      }
    }

    // Enforce max number of different days per week
    const requestedDays = Object.keys(slotsByDay);

    // Count already booked distinct days for this week
    const currentWeekStart = new Date();
    currentWeekStart.setDate(
      currentWeekStart.getDate() - currentWeekStart.getDay()
    );

    const alreadyBookedSlots = await bookings.findAll({
      where: {
        studentId,
        createdAt: { [Op.gte]: currentWeekStart },
      },
      include: [{ model: timeSlots, attributes: ["day"] }],
    });

    const alreadyBookedDays = new Set(
      alreadyBookedSlots
        .map((b) => b.TimeSlot?.day?.toLowerCase())
        .filter(Boolean)
    );

    const totalDays = new Set([...requestedDays, ...alreadyBookedDays]);

    if (totalDays.size > maxWeeklyDays) {
      return {
        success: false,
        error: `You can only book up to ${maxWeeklyDays} different day(s) per week.`,
      };
    }

    // Proceed to create bookings
    for (const slot of slots) {
      if (slot.isBooked) {
        const existingBooking = await bookings.findOne({
          where: { timeSlotId: slot.timeSlotId },
          order: [["createdAt", "DESC"]],
        });

        if (existingBooking && existingBooking.status !== "completed") {
          return {
            success: false,
            error: `Time slot with ID ${slot.timeSlotId} is already booked.`,
          };
        }
      }

      const alreadyBooked = await bookings.findOne({
        where: {
          timeSlotId: slot.timeSlotId,
          studentId,
        },
      });

      if (alreadyBooked) {
        return {
          success: false,
          error: `Student already booked this time slot (${slot.timeSlotId}).`,
        };
      }

      const booking = await bookings.create({
        timeSlotId: slot.timeSlotId,
        studentId,
        driverId,
      });

      slot.isBooked = true;
      await slot.save();

      createdBookings.push(booking);
    }

    return {
      success: true,
      data: createdBookings,
    };
  } catch (error) {
    logger.error("Error creating bookings:", error);
    return {
      success: false,
      error: error.message || "Failed to create bookings.",
    };
  }
};


//handle attendance
export const handleAttendanceForPracticals = async (studentId) => {
  try {
    const student = await registeredSelectedService.findOne({ where: { studentId } });

    if (!student) {
      return { success: false, error: "Student service record not found." };
    }
    // Optional: ensure they haven't exceeded the max
    const max = student.noOfPracticalHours;
    if (student.totalDone >= max) {
      return { success: false, error: "Maximum number of practical hours already completed." };
    }
    student.totalDone += 1;
    await student.save();
    return {
      success: true,
      message: "Attendance marked successfully.",
      totalDone: student.totalDone,
    };
  } catch (error) {
    logger.error("handleAttendanceForPracticals error:", error);
    return {
      success: false,
      error: "Failed to update attendance.",
    };
  }
};


//getting all booked practical sessions in the system
export const getAllPracticalSessions= async  () => {
  try {
    const allBookings = await bookings.findAll({
      include: [
        {
          model: studentModel,
          attributes: ["firstName","lastName","otherName", "phoneOne"],
        },
        {
          model: instructorModel,
          as: "Staff",
          attributes: ["fullname", "phoneOne"],
        },
        {
          model: timeSlots,
          attributes: ["day", "startTime", "endTime"]
        }
      ],
    });
    const result = allBookings.map(booking => ({
      studentName: booking.Student?.firstName + " " + booking.Student?.lastName + " " + booking.Student?.otherName ,
      studentPhone: booking.Student?.phoneOne,
      instructorName: booking.Instructor?.fullname,
      instructorPhone: booking.Instructor?.phoneOne,
      time: booking.TimeSlot ? {
        day: booking.TimeSlot.day,
        start: booking.TimeSlot.startTime,
        end: booking.TimeSlot.endTime
      } : null
    }));

    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to fetch booked slots."
    };
  }
};