import { parse, addMinutes, isBefore, format } from "date-fns";
import logger from "../config/logger.js";
import { bookings, timeSlots } from "../models/index.js";

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


export const createMultipleBookingsService = async ({ timeSlotIds, studentId, driverId }) => {
  const createdBookings = [];

  try {
    for (const timeSlotId of timeSlotIds) {
      const slot = await timeSlots.findByPk(timeSlotId);

      if (!slot) {
        return {
          success: false,
          error: `Time slot with ID ${timeSlotId} not found.`,
        };
      }

      if (slot.isBooked) {
        const existingBooking = await bookings.findOne({
          where: { timeSlotId },
          order: [["createdAt", "DESC"]],
        });

        if (existingBooking && existingBooking.status !== "completed") {
          return {
            success: false,
            error: `Time slot with ID ${timeSlotId} is already booked and not yet completed.`,
          };
        }
      }

      const booking = await bookings.create({
        timeSlotId,
        studentId,
        driverId,
        status: "in_session",
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
    logger.error("Error in createMultipleBookingsService:", error);
    return {
      success: false,
      error: error.message || "Failed to create bookings.",
    };
  }
};