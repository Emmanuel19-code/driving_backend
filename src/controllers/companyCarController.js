import logger from "../config/logger.js";
import {
  allcars,
  allMonthsAmount,
  createCarDocument,
  handleCarDocumentsRenewal,
  handlefuelRecharge,
  monthlyFuel,
  registerCompanyCar,
  searchCar,
  totalLitresConsumedMonthlyByEachCar,
} from "../services/companyCarService.js";
import { carDocumentValidate, carValidate, fuelRechargeValidate } from "../validations/car.js";

export const addCompanyCar = async (req, res) => {
  try {
    const { error, value } = carValidate.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const result = await registerCompanyCar(value); // Await the result

    if (!result.success) {
      return res
        .status(409)
        .json({ error: result.error || "Could not create car" });
    }

    res.status(200).json({ car: result.data });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      msg: error.message || "Internal server error",
    });
  }
};

export const markCarAsFaulty = async (req, res) => {
  try {
    const carId = req.params;
    if (!carId) {
      return res.status(400).json({
        msg: "Provide CarId",
      });
    }
  } catch (error) {
    logger.error(error);
    return res.status(400).json({
      msg: error.message || "Internal server error",
    });
  }
};

export const getAllCars = async (req, res) => {
  try {
    const cars = await allcars();
    res.status(200).json(cars);
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      msg: "Internal server error",
    });
  }
};

export const getCar = async (req, res) => {
  try {
    const { carId } = req.params;
    if (!carId) {
      return res.status(400).json({
        msg: "provide car Id",
      });
    }
    const car = searchCar(carId);
    if (!car) {
      return res.status(404).json({
        msg: "Cannot registered at the moment",
      });
    }
    res.status(200).json(car);
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      msg: "Internal server error",
    });
  }
};

export const assignCar = async (req, res) => {};

export const fuelRefill = async (req, res) => {
  try {
    const { error, value } = fuelRechargeValidate.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const result = await handlefuelRecharge(value);
    if (!result.success) {
      return res
        .status(409)
        .json({ error: result.error || "Could not save the record" });
    }
    res.status(201).json({
      msg: result.msg,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      msg: "Internal server error",
    });
  }
};

export const fetchTotalMonthlyAmontSpentFuel = async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const result = await allMonthsAmount(year);

    if (!result.success) {
      return res.status(500).json({ msg: result.error });
    }

    res.status(200).json({
      year,
      totalAmount: result.data,
      message: `Total fuel amount spent per month for ${year}`,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      msg: "Internal server error",
    });
  }
};

export const montlyLitresCarConsumption = async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const result = await totalLitresConsumedMonthlyByEachCar(year);
    if (!result.success) {
      return res.status(500).json({ msg: result.error });
    }
    res.status(200).json({
      data: result.data,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      msg: "Internal server error",
    });
  }
};

export const IndividualMonthlyFuelSpent = async (req, res) => {
  try {
    const { month } = req.params;
    if (!month) {
      return res.status(400).json({
        msg: "provide the month you want to check",
      });
    }
    const totalAmount = await monthlyFuel(month);
    res.status(200).json({
      totalAmount,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      msg: "Internal server error",
    });
  }
};

export const updateCarDocumentStatus = async (req, res) => {
  try {
    const { docId } = req.params;
    const {error,value} = carDocumentValidate.validate(req.body)
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const result = await handleCarDocumentsRenewal(docId, value);
    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }
    return res.status(200).json({
      message: result.message,
      data: result.renewal,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const addCarDocument = async (req, res) => {
  try {
    const { error, value } = carDocumentValidate.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const result = await createCarDocument(value);

    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }

    res.status(201).json({
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};