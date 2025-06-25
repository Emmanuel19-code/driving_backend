import { DataTypes } from "sequelize";

const recordFuel = (sequelize) => {
  const fuelmodel = sequelize.define(
    "LogFuel",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      carRegistrationNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      refilledBy: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amountloaded: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      litres: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "logfuel",
      timestamps: true,
    }
  );
  return fuelmodel;
};

export default recordFuel;
