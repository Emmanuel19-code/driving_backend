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
      return res.status(400).json({ error: error.details[0].message });
    }
    const service = await addNewService(value); // corrected typo
    if (!service) {
      return res.status(409).json({ msg: "Service could not be created" });
    }
    return res.status(201).json({ msg: "service has been added" }, service);
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

export const getRegisteredService = async (req, res) => {
  try {
    const services = await getServices();
    return res.status(200).json(services);
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

export const deleteRegisteredService = async (req, res) => {
  const { serviceId } = req.params;
  if (!serviceId) {
    return res.status(400).json({ msg: "Service ID is required to delete" });
  }
  try {
    const deletedCount = await deleteServices(serviceId);
    if (deletedCount === 0) {
      return res.status(404).json({ msg: "Service not found" });
    }
    return res.status(200).json({ msg: "Service deleted successfully" });
  } catch (error) {
    logger.error("❌ Error deleting service:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};
