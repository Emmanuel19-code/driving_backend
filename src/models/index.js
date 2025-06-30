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
import studentRegisteredService from "./StudentChosenService.js";
import UserModel from "./userModel.js";
import TenantModel from "./tenantModel.js";
import expenseModel from "./expense.js";

export const registerModels = (sequelize) => {
  const StudentIdCounter = StudentIdCounterModel(sequelize);
  const InstructorIdCounter = InstructorIdCounterModel(sequelize);

  const studentModel = StudentModel(sequelize, StudentIdCounter);
  const instructorModel = InstructorModel(sequelize, InstructorIdCounter);
  const serviceModels = serviceModel(sequelize);
  const paymentModel = PaymentModel(sequelize);
  const carModel = companyCarModel(sequelize);
  const fuelmodel = recordFuel(sequelize);
  const carDocModel = carDocumentSchema(sequelize);
  const bookings = bookSlotModel(sequelize);
  const timeSlots = timeSlotModel(sequelize);
  const studentChosenService = studentRegisteredService(sequelize);
  const expense = expenseModel(sequelize)
  // Define relationships
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

  studentChosenService.belongsTo(studentModel, {
    foreignKey: "studentId",
    targetKey: "studentId",
  });
studentModel.hasMany(studentChosenService, {
  foreignKey: "studentId",
  sourceKey: "studentId",
  as: "chosenServices", // <-- this is the alias you must use
});

paymentModel.belongsTo(studentModel, {
  foreignKey: "paidBy",     
  targetKey: "studentId",   
  as: "student",            
});

studentChosenService.belongsTo(serviceModels, {
  foreignKey: "serviceTypeId",
  targetKey: "serviceId",
  as: "serviceInfo",
});

 studentModel.hasMany(paymentModel, {
  foreignKey: "paidBy",
  sourceKey: "studentId",
});


  return {
    studentModel,
    instructorModel,
    studentIdCounter: StudentIdCounter,
    serviceModels,
    paymentModel,
    carModel,
    fuelmodel,
    carDocModel,
    timeSlots,
    bookings,
    studentChosenService,
    expense
  };
};

let tenantModel, userModel;

export const registerAccessModels = (sequelize) => {
  userModel = UserModel(sequelize);
  tenantModel = TenantModel(sequelize);

  userModel.belongsTo(tenantModel, {
    foreignKey: "tenantId",
    targetKey: "tenantId",
  });
  tenantModel.hasMany(userModel, {
    foreignKey: "tenantId",
    sourceKey: "tenantId",
  });

  return { userModel, tenantModel };
};

export { tenantModel, userModel };
