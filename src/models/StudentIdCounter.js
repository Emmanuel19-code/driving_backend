import { DataTypes } from "sequelize";
import logger from "../config/logger.js";

const StudentIdCounterModel = (sequelize) => {
  try {
    return sequelize.define(
      "StudentIdCounter",
      {
        year: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        count: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
          allowNull: false,
        },
      },
      {
        tableName: "student_id_counters",
        timestamps: false,
      }
    );
  } catch (error) {
    logger.error(error)
  }
};

export default StudentIdCounterModel;
