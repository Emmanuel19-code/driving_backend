import { DataTypes } from "sequelize";

const studentRegisteredService = (sequelize) => {
  const studentChosenService = sequelize.define(
    "studentChosenService",
    {
      studentId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      serviceTypeId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      classCompleted: {
        type: DataTypes.STRING,
        defaultValue: false,
      },
      totalDurationForService: {
        type: DataTypes.STRING,
      },
      practicalStatus: {
        type: DataTypes.STRING,
        defaultValue: "not started",
      },
      noOfDaysInClass: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      noOfPracticalHours: {
        type: DataTypes.INTEGER,
      },
      chosenDaysforPracticals: {
        type: DataTypes.STRING,
        defaultValue: "no days selected",
      },
      chosenTimesforPracticals: {
        type: DataTypes.STRING,
        defaultValue: "cannot select time for practicals yet",
      },
      totalDone: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: "studentChosenService",
      timestamps: true,
    }
  );
  return studentChosenService;
};

export default studentRegisteredService;