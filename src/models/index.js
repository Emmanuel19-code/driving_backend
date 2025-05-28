import InstructorModel from "./Instructor.js";
import StudentModel from "./Student.js";
import StudentIdCounterModel from "./StudentIdCounter.js";
import InstructorIdCounterModel from "./InstructorIdCounter.js";

let studentModel;
let instructorModel;

export const registerModels = (sequelize) => {
  //console.log("Registering models...",sequelize);
  const StudentIdCounter = StudentIdCounterModel(sequelize);
  
  const InstructorIdCounter = InstructorIdCounterModel(sequelize);

  studentModel = StudentModel(sequelize, StudentIdCounter);
  instructorModel = InstructorModel(sequelize, InstructorIdCounter);
  console.log("stdm",studentModel);
  console.log("intm",instructorModel)
};

export  {studentModel,instructorModel}