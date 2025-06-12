import InstructorModel from "./Instructor.js";
import StudentModel from "./Student.js";
import StudentIdCounterModel from "./StudentIdCounter.js";
import InstructorIdCounterModel from "./InstructorIdCounter.js";
import serviceModel from "./services.js";
import PaymentModel from "./paymentModel.js";
import companyCarModel from "./companyCars.js";
import recordFuel from "./recordfuelLoad.js";
import carDocumentSchema from "./carDocuments.js";


let studentModel;
let instructorModel;
let studentIdCounter;
let serviceModels;
let paymentModel;
let carModel;
let fuelmodel;
let carDocModel;
export const registerModels = (sequelize) => {
  const StudentIdCounter = StudentIdCounterModel(sequelize);
  const InstructorIdCounter = InstructorIdCounterModel(sequelize);
  paymentModel = PaymentModel(sequelize);
  serviceModels = serviceModel(sequelize);
  carModel = companyCarModel(sequelize);
  fuelmodel = recordFuel(sequelize);
  carDocModel = carDocumentSchema(sequelize)
  studentModel = StudentModel(sequelize, StudentIdCounter);
  instructorModel = InstructorModel(sequelize, InstructorIdCounter);
  studentIdCounter = StudentIdCounter;
};

export {
  studentModel,
  instructorModel,
  studentIdCounter,
  serviceModels,
  paymentModel,
  carModel,
  fuelmodel,
  carDocModel
};
