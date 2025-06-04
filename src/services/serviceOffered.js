import { serviceModels } from "../models/index.js";


export const addNewService = async (serviceData) =>{
   return await serviceModels.create(serviceData)
}

export const getServices = async () =>{
    return await serviceModels.findAll();
}

export const deleteServices = async (serviceId) =>{
    return await serviceModels.destroy({
        where:{serviceId:serviceId}
    })
}