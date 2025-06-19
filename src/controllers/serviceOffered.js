import logger from "../config/logger.js";
import {
  addNewService,
  deleteServices,
  getServices,
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
