

export const addNewService = async (tenantContext, serviceData) => {
  const { serviceModels } = tenantContext.models;
  return await serviceModels.create(serviceData);
};

export const getServices = async (tenantContext) => {
  const { serviceModels } = tenantContext.models;
  return await serviceModels.findAll();
};

export const deleteServices = async (tenantContext, serviceId) => {
  const { serviceModels } = tenantContext.models;
  return await serviceModels.destroy({
    where: { serviceId },
  });
};
