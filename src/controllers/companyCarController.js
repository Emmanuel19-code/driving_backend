import logger from "../config/logger.js";
import {
  allcars,
  handlefuelRecharge,
  monthlyFuel,
  registerCompanyCar,
  searchCar,
} from "../services/companyCarService.js";
import { carValidate, fuelRechargeValidate } from "../validations/car.js";

export const addCompanyCar = async (req, res) => {
  try {
    const { error, value } = carValidate.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const car = registerCompanyCar(value);
    if (!car) {
      return res.status(409).json({
        msg: "could not create",
      });
    }
    res.status(200).json({ car });
  } catch (error) {
    logger.error(error);
    return res.status(400).json({
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
    const {carId} = req.params;
    if(!carId)
    {
      return res.status(400).json({
        msg:"provide car Id"
      })
    }
    const car = searchCar(carId)
    if(!car){
      return res.status(404).json({
        msg:"Cannot registered at the moment"
      })
    }
    res.status(200).json(car)
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
    const fuelRecharged = await handlefuelRecharge(value);
    if (!fuelRecharged) {
      return res.status(409).json({
        msg: "Could not register the loaded fuel try again",
      });
    }
    res.status(201).json({
      msg: "fuel has loaded recorded",
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
     const totalAmount = await allMonthsAmount()
     res.status(200).json({
      totalAmount
     })
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      msg: "Internal server error",
    });
  }
};

export const IndividualMonthlyFuelSpent = async (req,res) =>{
  try {
    const { month } = req.params;
    if(!month){
       return res.status(400).json({
        msg:"provide the month you want to check"
       })
    }
    const totalAmount = await monthlyFuel(month)
    res.status(200).json({
       totalAmount
    })
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      msg: "Internal server error",
    });
  }
  
}