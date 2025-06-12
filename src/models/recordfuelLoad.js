import { DataTypes } from "sequelize";

const recordFuel = (sequelize)=>{
    const fuelmodel = sequelize.define(
      "LogFuel",
      {
        carRegistrationNumber:{
            type:DataTypes.STRING,
            allowNull:false
        },
        refilledBy:{
          type:DataTypes.STRING,
          allowNull:false
        },
        amountloaded:{
            type:DataTypes.STRING,
            allowNull:false
        },
        litres:{
           type:DataTypes.STRING,
           //allowNull:false
        }
      },
      {
        tableName: "logfuel",
        timestamps: true,
      }
    );
    return fuelmodel;
}

export default recordFuel;