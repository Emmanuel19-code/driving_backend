import InstructorModel from "./instructor.js";
import StudentModel from "./student.js";
import StudentIdCounterModel from "./StudentIdCounter.js";
import InstructorIdCounterModel from "./InstructorIdCounter.js";
import serviceModel from "./services.js";
import PaymentModel from "./paymentModel.js";
import companyCarModel from "./companyCars.js";
import recordFuel from "./recordfuelLoad.js";
import carDocumentSchema from "./carDocuments.js";
import bookSlotModel from "./bookSlots.js";
import timeSlotModel from "./timeSlots.js";
import studentRegisteredService from "./registeredStudentChosenService.js";

let studentModel;
let instructorModel;
let studentIdCounter;
let serviceModels;
let paymentModel;
let carModel;
let fuelmodel;
let carDocModel;
let timeSlots;
let bookings;
let registeredSelectedService;
export const registerModels = (sequelize) => {
  const StudentIdCounter = StudentIdCounterModel(sequelize);
  const InstructorIdCounter = InstructorIdCounterModel(sequelize);
  paymentModel = PaymentModel(sequelize);
  serviceModels = serviceModel(sequelize);
  carModel = companyCarModel(sequelize);
  fuelmodel = recordFuel(sequelize);
  carDocModel = carDocumentSchema(sequelize);
  bookings = bookSlotModel(sequelize);
  registeredSelectedService = studentRegisteredService(sequelize);
  studentModel = StudentModel(sequelize, StudentIdCounter);
  instructorModel = InstructorModel(sequelize, InstructorIdCounter);
  timeSlots = timeSlotModel(sequelize);
  studentIdCounter = StudentIdCounter;

  // Booking relationships
  bookings.belongsTo(timeSlots, {
    foreignKey: "timeSlotId",
    targetKey: "timeSlotId",
  });
  timeSlots.hasMany(bookings, {
    foreignKey: "timeSlotId",
    sourceKey: "timeSlotId",
  });

  bookings.belongsTo(studentModel, {
    foreignKey: "studentId",
    targetKey: "studentId",
  });
  studentModel.hasMany(bookings, {
    foreignKey: "studentId",
    sourceKey: "studentId",
  });

  bookings.belongsTo(instructorModel, {
    foreignKey: "driverId",
    targetKey: "staffId",
    as: "Staff",
  });
  instructorModel.hasMany(bookings, {
    foreignKey: "driverId",
    sourceKey: "staffId",
    as: "StaffBookings",
  });
  registeredSelectedService.belongsTo(studentModel, {
    foreignKey: "studentId",
    targetKey: "studentId",
  });
  studentModel.hasMany(registeredSelectedService, {
    foreignKey: "studentId",
    sourceKey: "studentId",
  });
};


export {
  studentModel,
  instructorModel,
  studentIdCounter,
  serviceModels,
  paymentModel,
  carModel,
  fuelmodel,
  carDocModel,
  timeSlots,
  bookings,
  registeredSelectedService,
};
