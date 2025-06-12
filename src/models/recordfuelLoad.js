import { DataTypes } from "sequelize";

const recordFuel = (sequelize)=>{
    const fuelmodel = sequelize.define(
      "LogFuel",
      {
        carId:{
            type:DataTypes.STRING,
            allowNull:false
        },
        amountloaded:{
            type:DataTypes.STRING,
            allowNull:false
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