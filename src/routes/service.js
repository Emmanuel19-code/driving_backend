import express from "express";
import {
  deleteRegisteredService,
  getRegisteredService,
  getServicesIdAndNameController,
  registerService,
  updateServiceController,
} from "../controllers/serviceOffered.js";
import { authMiddleware } from "../middlewares/authMiddleWare.js";
import { tenantContextMiddleware } from "../middlewares/tenantContextMiddleWare.js";

const router = express.Router();

router.post(
  "/add_newService",
  authMiddleware,
  tenantContextMiddleware,
  registerService
);
router.get(
  "/getAllServices",
  authMiddleware,
  tenantContextMiddleware,
  getRegisteredService
);
router.delete(
  "/delete_service:serviceId",
  authMiddleware,
  tenantContextMiddleware,
  deleteRegisteredService
);
router.put(
  "/update_service/:serviceId",
  authMiddleware,
  tenantContextMiddleware,
  updateServiceController
);
router.get("/servicesId_and_name",authMiddleware,tenantContextMiddleware,getServicesIdAndNameController)

export default router;
