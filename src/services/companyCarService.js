import { col, fn, Op } from "sequelize";
import { carDocModel, carModel, fuelmodel } from "../models/index.js";

export const findCar = async (value) => {
  return await carModel.findOne({ where: { carRegistrationNumber: value } });
};

export const registerCompanyCar = async (value) => {
  try {
    const { carRegistrationNumber } = value;
    const car = await findCar(carRegistrationNumber);
    if (car) {
      throw new Error("Car Already Registered");
    }
    const newCar = await carModel.create(value);
    return { success: true, data: newCar };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const allcars = async () => {
  return await carModel.findAll({
    attributes: ["carRegistrationNumber"],
  });
};

export const searchCar = async (value) => {
  return await carModel.findOne({ where: { carId: value } });
};

export const handlefuelRecharge = async (value) => {
  try {
    const { carRegistrationNumber, amountLoaded } = value;
    const recharge = await fuelmodel.create(value);
    if (!recharge) {
      throw new Error("Record Could not be taken try again");
    }
    return {
      success: true,
      msg: `Recorded fuel loaded for car with Number ${carRegistrationNumber}`,
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const monthlyFuel = async (value) => {};

export const allMonthsAmount = async (year) => {
  try {
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year + 1, 0, 1);

    const results = await fuelmodel.findAll({
      attributes: [
        [fn("MONTH", col("createdAt")), "month"],
        [fn("SUM", col("amountloaded")), "totalAmount"],
      ],
      where: {
        createdAt: {
          [Op.gte]: startOfYear,
          [Op.lt]: endOfYear,
        },
      },
      group: [fn("MONTH", col("createdAt"))],
      order: [[fn("MONTH", col("createdAt")), "ASC"]],
      raw: true,
    });

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const monthlyTotals = {};
    monthNames.forEach((month) => {
      monthlyTotals[month] = 0;
    });

    results.forEach((row) => {
      const monthIndex = row.month - 1;
      monthlyTotals[monthNames[monthIndex]] = Number(row.totalAmount);
    });

    return {
      success: true,
      data: monthlyTotals,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Could not calculate monthly fuel totals.",
    };
  }
};


export const totalLitresConsumedMonthlyByEachCar = async (year) => {
  try {
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year + 1, 0, 1);

    const results = await fuelmodel.findAll({
      attributes: [
        "carRegistrationNumber",
        [fn("MONTH", col("createdAt")), "month"],
        [fn("SUM", col("litres")), "totalLitres"]
      ],
      where: {
        createdAt: {
          [Op.gte]: startOfYear,
          [Op.lt]: endOfYear
        }
      },
      group: ["carRegistrationNumber", fn("MONTH", col("createdAt"))],
      order: [
        ["carRegistrationNumber", "ASC"],
        [fn("MONTH", col("createdAt")), "ASC"]
      ],
      raw: true
    });

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const carLitresMap = {};
    results.forEach((row) => {
      const month = monthNames[row.month - 1];
      const car = row.carRegistrationNumber;

      if (!carLitresMap[car]) {
        carLitresMap[car] = {};
        monthNames.forEach((m) => {
          carLitresMap[car][m] = 0;
        });
      }
      carLitresMap[car][month] = Number(row.totalLitres);
    });
    return {
      success: true,
      data: carLitresMap
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Could not calculate litres consumed."
    };
  }
};

export const handleCarDocumentsRenewal = async (docId, value) => {
  try {
    const doc = await carDocModel.findOne({ where: { docId } });
    if (!doc) {
      return { success: false, message: "Document not found" };
    }
    if (doc.renewed) {
      return { success: false, message: "Document is already renewed" };
    }
    // Record the new expiry date in a separate table
    const renewal = await carDocModel.create(value);
    // Mark document as renewed
    doc.renewed = true;
    await doc.save();

    return {
      success: true,
      message: "Document renewed successfully",
      renewal,
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
};


export const createCarDocument = async (value) => {
  try {
    const existingDoc = await carDocModel.findOne({
      where: {
        carRegistrationNumber: value.carRegistrationNumber,
        documentType: value.documentType,
      },
    });

    if (existingDoc) {
      return {
        success: false,
        message: "This document for the car is already registered in the system.",
      };
    }
    const newDoc = await carDocModel.create(value);
    if (!newDoc) {
      return {
        success: false,
        message: "Failed to create document record, try again.",
      };
    }
    return {
      success: true,
      message: "Document registered successfully",
      data: newDoc,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};
