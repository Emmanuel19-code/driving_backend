import logger from "../config/logger.js";

export const addNewService = async (tenantContext, serviceData) => {
  const { serviceModels } = tenantContext.models;
  return await serviceModels.create(serviceData);
};

export const getServices = async (tenantContext) => {
  try {
    const { serviceModels } = tenantContext.models;
    return await serviceModels.findAll();
  } catch (error) {
    logger.error("Error updating service:", error);
    return {
      success: false,
      error: error.message || "An error occurred while updating the service",
    };
  }
};

export const deleteServices = async (tenantContext, serviceId) => {
  const { serviceModels } = tenantContext.models;
  return await serviceModels.destroy({
    where: { serviceId },
  });
};

export const updateService = async (tenantContext, serviceId, updates) => {
  const { serviceModels } = tenantContext.models;
  try {
    const service = await serviceModels.findOne({ where: { serviceId } });
    if (!service) {
      return {
        success: false,
        error: "Service not found",
      };
    }
    await service.update(updates);
    return {
      success: true,
      data: service,
    };
  } catch (error) {
    logger.error("Error updating service:", error);
    return {
      success: false,
      error: error.message || "An error occurred while updating the service",
    };
  }
};


export const getServicesIdAndName = async (tenantContext) => {
  try {
    const { serviceModels } = tenantContext.models;
    const services = await serviceModels.findAll({
      attributes: ['serviceId', 'serviceType'], 
    });
    return {
      success: true,
      data: services,
    };
  } catch (error) {
    logger.error("Failed to fetch services:", error);
    return {
      success: false,
      error: error.message || "An error occurred while fetching services",
    };
  }
};