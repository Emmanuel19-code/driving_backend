import { createMultipleBookingsService, generateAllTimeSlots, getAllTimeSlots } from "../services/scheduleService.js";
import { bookingSchema } from "../validations/practical.js";

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


export const createBookings = async (req, res) => {
  try {
    const { error, value } = bookingSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message || "Invalid input",
      });
    }

    const result = await createMultipleBookingsService({
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
    console.error("Create booking error:", err);
    return res.status(500).json({
      success: false,
      error: "Internal server error.",
    });
  }
};
