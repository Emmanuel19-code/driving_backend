import { serviceModels } from "../models/index.js";


export const addNewServcie = async (serviceData) =>{
   return await serviceModels.create(serviceData)
}

export const getServices = async () =>{
    return await serviceModels.findAll();
}