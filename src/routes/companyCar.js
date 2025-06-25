import express from "express";
import {
    addCarDocument,
  addCompanyCar,
  fetchTotalMonthlyAmontSpentFuel,
  fuelRefill,
  getAllFuels,
  getCar,
  getOnlyCarRegistrationNumber,
  montlyLitresCarConsumption,
  updateCarDocumentStatus,
} from "../controllers/companyCarController.js";
import { authMiddleware } from "../middlewares/authMiddleWare.js";
import { tenantContextMiddleware } from "../middlewares/tenantContextMiddleWare.js";

const router = express.Router();

router.post("/add_car",authMiddleware,tenantContextMiddleware, addCompanyCar);
router.get("/get_car_registration_number",authMiddleware,tenantContextMiddleware,getOnlyCarRegistrationNumber);
router.get("/search_car/:carRegistrationNumber",authMiddleware,tenantContextMiddleware,getCar);
router.post("/record_fuel_refill",authMiddleware,tenantContextMiddleware,fuelRefill);
router.get("/monthly-amount",authMiddleware,tenantContextMiddleware,fetchTotalMonthlyAmontSpentFuel);
router.get("/monthly-litres-car-consumption",authMiddleware,tenantContextMiddleware,montlyLitresCarConsumption);
router.post("/documents",authMiddleware,tenantContextMiddleware,addCarDocument)
router.put("/documents/:docId/renew",authMiddleware,tenantContextMiddleware,updateCarDocumentStatus);
router.get("/all_fuel_records",authMiddleware,tenantContextMiddleware,getAllFuels)

export default router;
