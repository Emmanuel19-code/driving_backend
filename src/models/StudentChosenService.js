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
      startedClass:{
        type:DataTypes.STRING,
        defaultValue:"not_started"
      },
      classCompleted: {
        type: DataTypes.STRING,
        defaultValue: "not_completed",
      },
      totalDurationForService: {
        type: DataTypes.STRING,
      },
      startedPractical:{
        type:DataTypes.STRING,
        defaultValue:"not_started"
      },
      practicalStatus: {
        type: DataTypes.STRING,
        defaultValue: "not_completed",
      },
      noOfDaysInClass: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      noOfPracticalHours: {
        type: DataTypes.INTEGER,
      },
      allowedDays: {
        type: DataTypes.STRING,
      },
      noOfTimesWeekly:{
        type:DataTypes.INTEGER,
        allowNull:false
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