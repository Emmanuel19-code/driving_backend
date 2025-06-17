import {  generateAllTimeSlots, getAllPracticalSessions, getAllTimeSlots, handleAttendanceForPracticals, practicalPeriodService } from "../services/scheduleService.js";
import { bookingSchema } from "../validations/practical.js";

//generate the timeSlots
export const generateSchedule = async (req, res) => {
  try {
    const { days, startTime, endTime } = req.body;
    // Validate input
    if (!days || !startTime || !endTime) {
      return res.status(400).json({
        message: "Please provide 'days', 'startTime', and 'endTime'.",
      });
    }

    const result = await generateAllTimeSlots({
      days,
      startTime,
      endTime,
    });

    return res.status(201).json(result);
  } catch (error) {
    console.error("Error in generateSchedule controller:", error.message);
    return res.status(500).json({
      message: "Internal server error. Could not generate time slots.",
    });
  }
};

//getting all times available
export const allGeneratedTimes = async (req, res) => {
  try {
    const result = await getAllTimeSlots();
    if (!result.success) {
      return res.status(409).json({ error: result.error });
    }
    return res.status(200).json({ slots: result.slots });
  } catch (error) {
    return res.status(500).json({
      error: error.message || "An unexpected error occurred.",
    });
  }
};

//booking students for practicals
export const createBookings = async (req, res) => {
  try {
    const { error, value } = bookingSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message || "Invalid input",
      });
    }

    const result = await practicalPeriodService({
      timeSlotIds: value.timeSlotIds,
      studentId: value.studentId,
      driverId: value.driverId,
    });

    if (!result.success) {
      return res.status(409).json({ success: false, error: result.error });
    }

    return res.status(201).json({
      success: true,
      message: "Booking(s) created successfully.",
      data: result.data,
    });
  } catch (err) {
    logger.error("Create booking error:", err);
    return res.status(500).json({
      success: false,
      error: "Internal server error.",
    });
  }
};


//marking attendance
export const markAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;
    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "Student ID is required",
      });
    }
    const result = await handleAttendanceForPracticals(studentId);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error,
      });
    }
    return res.status(200).json({
      success: true,
      message: result.message,
      totalDone: result.totalDone,
    });
  } catch (error) {
    logger.error("markAttendance error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

//getting all booked sessions
export const fetchAllBookedSlots = async (req, res) => {
  try {
    const result = await getAllPracticalSessions();
    if (!result.success) {
      return res.status(500).json({ success: false, error: result.error });
    }
    return res.status(200).json({ success: true, data: result.data });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Server error" });
  }
};
