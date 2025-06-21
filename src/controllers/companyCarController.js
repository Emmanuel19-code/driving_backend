import logger from "../config/logger.js";
import {
  allMonthsAmount,
  createCarDocument,
  gettingRegistrationNumberOfCars,
  handleCarDocumentsRenewal,
  handlefuelRecharge,
  monthlyFuel,
  registerCompanyCar,
  searchCar,
  totalLitresConsumedMonthlyByEachCar,
} from "../services/companyCarService.js";
import {
  carDocumentValidate,
  carValidate,
  fuelRechargeValidate,
} from "../validations/car.js";

export const addCompanyCar = async (req, res) => {
  try {
    const { error, value } = carValidate.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const result = await registerCompanyCar(req.tenantContext, value);
    if (!result.success) {
      return res
        .status(409)
        .json({ error: result.error || "Could not create car" });
    }

    res.status(200).json({ car: result.data });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ msg: error.message || "Internal server error" });
  }
};

export const markCarAsFaulty = async (req, res) => {
  try {
    const carId = req.params;
    if (!carId) {
      return res.status(400).json({ msg: "Provide CarId" });
    }
    // Implementation pending
  } catch (error) {
    logger.error(error);
    return res
      .status(400)
      .json({ msg: error.message || "Internal server error" });
  }
};

export const getOnlyCarRegistrationNumber = async (req, res) => {
  try {
    const cars = await gettingRegistrationNumberOfCars(req.tenantContext);
    res.status(200).json(cars);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const getCar = async (req, res) => {
  try {
    const { carRegistrationNumber } = req.params;
    console.log(carRegistrationNumber);
    
    if (!carRegistrationNumber) {
      return res.status(400).json({ msg: "Provide carRegistrationNumber" });
    }

    const car = await searchCar(req.tenantContext, carRegistrationNumber);
    if (!car) {
      return res.status(404).json({ msg: "Car not found" });
    }

    res.status(200).json(car);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyY2Q2ZDViNy1mZTNkLTRmMDgtYTQ5NC02OTNlMjZhMTg1NDIiLCJ0ZW5hbnRJZCI6IjE3MjgxNmI2LTY2NmQtNGY3Mi05ODcwLTRiNmMyODdjODUwYyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1MDQxMDk2NiwiZXhwIjoxNzUwNDk3MzY2fQ._8K4HXffHIPhFgltyG6YoMNiF4Nhx7MECPYtV0CAQN4

export const assignCar = async (req, res) => {
  // Implementation pending
};

export const fuelRefill = async (req, res) => {
  try {
    const { error, value } = fuelRechargeValidate.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const result = await handlefuelRecharge(req.tenantContext, value);
    if (!result.success) {
      return res
        .status(409)
        .json({ error: result.error || "Could not save the record" });
    }

    res.status(201).json({ msg: result.msg });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const fetchTotalMonthlyAmontSpentFuel = async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const result = await allMonthsAmount(req.tenantContext, year);

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
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const montlyLitresCarConsumption = async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const result = await totalLitresConsumedMonthlyByEachCar(
      req.tenantContext,
      year
    );

    if (!result.success) {
      return res.status(500).json({ msg: result.error });
    }

    res.status(200).json({ data: result.data });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const IndividualMonthlyFuelSpent = async (req, res) => {
  try {
    const { month } = req.params;
    if (!month) {
      return res
        .status(400)
        .json({ msg: "Provide the month you want to check" });
    }

    const totalAmount = await monthlyFuel(req.tenantContext, month); // assumes implementation exists
    res.status(200).json({ totalAmount });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const updateCarDocumentStatus = async (req, res) => {
  try {
    const { docId } = req.params;
    const { error, value } = carDocumentValidate.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const result = await handleCarDocumentsRenewal(
      req.tenantContext,
      docId,
      value
    );
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

    const result = await createCarDocument(req.tenantContext, value);
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
