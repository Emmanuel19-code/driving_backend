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
import { authMiddleware } from "../middlewares/authMiddleWare.js";
import { tenantContextMiddleware } from "../middlewares/tenantContextMiddleWare.js";

const router = express.Router();

router.post("/add_car",authMiddleware,tenantContextMiddleware, addCompanyCar);
router.get("/get_cars",authMiddleware,tenantContextMiddleware,getAllCars);
router.get("/search_car:carId",authMiddleware,tenantContextMiddleware,getCar);
router.post("/recharge_fuel",authMiddleware,tenantContextMiddleware,fuelRefill);
router.get("/monthly-amount",authMiddleware,tenantContextMiddleware,fetchTotalMonthlyAmontSpentFuel);
router.get("/monthly-litres-car-consumption",authMiddleware,tenantContextMiddleware,montlyLitresCarConsumption);
router.post("/documents",authMiddleware,tenantContextMiddleware,addCarDocument)
router.put("/documents/:docId/renew",authMiddleware,tenantContextMiddleware,updateCarDocumentStatus);

export default router;
