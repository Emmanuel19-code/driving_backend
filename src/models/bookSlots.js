import { DataTypes } from "sequelize";

const bookingModel = (sequelize) => {
  const Booking = sequelize.define(
    "Booking",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      studentId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      driverId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      timeSlotId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "timeSlots",   
          key: "timeSlotId",       
        },
      },
      status: {
        type: DataTypes.ENUM("in_session", "completed",),
        defaultValue: "in_session",
      },
    },
    {
      tableName: "bookings",
      timestamps: true,
    }
  );

  return Booking;
};

export default bookingModel;
