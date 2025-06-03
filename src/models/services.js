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
      fee: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      duration: {
        type: DataTypes.STRING,
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
