import { DataTypes } from "sequelize"

const companyCarModel = (sequelize)=>{
   const carmodel = sequelize.define(
     "companyCar",
     {
       carId: {
         type: DataTypes.STRING,
         unique: true,
       },
       carModel: {
         type: DataTypes.STRING,
         allowNull: false,
       },
       carColour: {
         type: DataTypes.STRING,
         allowNull: false,
       },
       carRegistrationNumber: {
         type: DataTypes.STRING,
         allowNull: false,
       },
       carUser: {
         type: DataTypes.STRING,
       },
       carRoadWorthyExpiry: {
         type: DataTypes.STRING,
       },
       carInsuaranceExpiry: {
         type: DataTypes.STRING,
       },
       carTransmissionType: {
         type: DataTypes.STRING,
         allowNull: false,
       },
       carFaulty: {
         type: DataTypes.BOOLEAN,
         default:false
       }
     },
     {
       tableName: "CompanyCars",
       timestamps: true,
     }
   );
    return carmodel
}

export default companyCarModel;