import { DataTypes } from "sequelize";

const timeSlotModel = (sequelize) => {
  const TimeSlot = sequelize.define(
    "TimeSlot",
    {
      timeSlotId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, 
        primaryKey: true,              
      },
      day: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      startTime: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      endTime: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isBooked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "timeSlots",
      timestamps: true,
    }
  );

  return TimeSlot;
};

export default timeSlotModel;

