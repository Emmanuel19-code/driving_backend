import { carModel } from "../models/index.js";

export const findCar = async (value) => {
  return await carModel.findOne({ where: { carRegistrationNumber: value } });
};

export const registerCompanyCar = async (value) => {
  const { carRegistrationNumber } = value;
  const car = await findCar(carRegistrationNumber);
  if (car) {
    throw new Error("Car Already Registered");
  }
  return await carModel.create(value);
};

export const allcars = async()=>{
  return await carModel.findAll()
}

export const searchCar = async(value)=>{
 return await carModel.findOne({where:{carId:value}})
}

export const handlefuelRecharge = async(value)=>{

}

export const monthlyFuel = async (value)=>{

}

export const allMonthsAmount = async (value)=>{
 
}