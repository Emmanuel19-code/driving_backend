import logger from "../config/logger.js";
import {
  addNewService,
  deleteServices,
  getServices,
  getServicesIdAndName,
  updateService,
} from "../services/serviceOffered.js";
import { serviceValidate } from "../validations/serviceOffered.js";

export const registerService = async (req, res) => {
  try {
    const { error, value } = serviceValidate.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, error: error.details[0].message });
    }

    const service = await addNewService(req.tenantContext, value);
    if (!service) {
      return res.status(409).json({ success: false, error: "Service could not be created" });
    }

    return res.status(201).json({ success: true, msg: "Service has been added", data: service });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const getRegisteredService = async (req, res) => {
  try {
    const services = await getServices(req.tenantContext);
    return res.status(200).json({ success: true, data: services });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const deleteRegisteredService = async (req, res) => {
  const { serviceId } = req.params;
  if (!serviceId) {
    return res.status(400).json({ success: false, error: "Service ID is required to delete" });
  }

  try {
    const deletedCount = await deleteServices(req.tenantContext, serviceId);
    if (deletedCount === 0) {
      return res.status(404).json({ success: false, error: "Service not found" });
    }

    return res.status(200).json({ success: true, msg: "Service deleted successfully" });
  } catch (error) {
    logger.error("❌ Error deleting service:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const updateServiceController = async (req, res) => {
  const { tenantContext } = req;
  const { serviceId } = req.params;
  const updates = req.body;
  
  if (!serviceId) {
    return res.status(400).json({
      success: false,
      error: "Missing serviceId in request params",
    });
  }
  if (!updates || typeof updates !== "object") {
    return res.status(400).json({
      success: false,
      error: "Invalid or missing update data in request body",
    });
  }
  const allowedFields = [
    "serviceType",
    "fee",
    "totalDuration",
    "noOfDaysInClass",
    "noOfPracticalHours",
    "noOfTimesWeekly",
    "allowedDays",
    "serviceDescription",
  ];
  const filteredUpdates = {};
  for (const key of allowedFields) {
    if (updates[key] !== undefined) {
      filteredUpdates[key] = updates[key];
    }
  }
  const result = await updateService(tenantContext, serviceId, filteredUpdates);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: result.error || "Failed to update service",
    });
  }
  return res.status(200).json({
    success: true,
    data: result.data,
  });
};


export const getServicesIdAndNameController = async (req, res) => {
  const tenantContext = req.tenantContext;
  const result = await getServicesIdAndName(tenantContext);
  if (!result.success) {
    return res.status(500).json({
      success: false,
      error: result.error,
    });
  }
  return res.status(200).json({
    success: true,
    data: result.data,
  });
};