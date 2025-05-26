import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import StudentIdCounter from "./StudentIdCounter.js";

const Student = sequelize.define(
  "Student",
  {
    studentId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    otherName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    phoneOne: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phoneTwo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    serviceType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "students",
    timestamps: true,
  }
);


Student.beforeCreate(async (student, options) => {
  const year = new Date().getFullYear().toString();

  const [counter, created] = await StudentIdCounter.findOrCreate({
    where: { year },
    defaults: { count: 1 },
  });

  if (!created) {
    counter.count += 1;
    await counter.save();
  }

  const padded = String(counter.count).padStart(3, '0');
  student.studentId = `STU${year}-${padded}`;
});

export default Student;
