import express from "express";
import {
    addCarDocument,
  addCompanyCar,
  fetchTotalMonthlyAmontSpentFuel,
  fuelRefill,
  getAllCars,
  getCar,
  montlyLitresCarConsumption,
  updateCarDocumentStatus,
} from "../controllers/companyCarController.js";

const router = express.Router();

router.post("/add_car", addCompanyCar);
router.get("/get_cars", getAllCars);
router.get("/search_car:carId", getCar);
router.post("/recharge_fuel", fuelRefill);
router.get("/monthly-amount", fetchTotalMonthlyAmontSpentFuel);
router.get("/monthly-litres-car-consumption", montlyLitresCarConsumption);
router.post("/documents",addCarDocument)
router.put("/documents/:docId/renew", updateCarDocumentStatus);

export default router;
