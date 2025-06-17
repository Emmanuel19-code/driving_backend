import { DataTypes } from "sequelize";

const serviceModel = (sequelize) => {
  const Service = sequelize.define(
    "Services",
    {
      serviceId: {
        type: DataTypes.STRING,
        //allowNull: false,
        // unique: true,
      },
      serviceType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      serviceDescription: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      totalDuration: {
        type: DataTypes.STRING,
        allowNull: false,
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
      fee: {
        type: DataTypes.DECIMAL(10, 0),
        allowNull: false,
      },
    },
    {
      tableName: "services",
      timestamps: true,
    }
  );

  // Auto-generate serviceId before creation
  Service.beforeCreate(async (service) => {
    const timestamp = Date.now().toString().slice(-5);
    service.serviceId = `SVC-${timestamp}`;
  });

  return Service;
};

export default serviceModel;
