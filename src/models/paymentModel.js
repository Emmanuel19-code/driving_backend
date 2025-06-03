import { DataTypes } from "sequelize";

const PaymentModel = (sequelize) =>{
  return sequelize.define(
    'Payments',
    {
        paymentId:{
            type: DataTypes.STRING,
            allowNull:false
        },
        paidBy:{
            type:DataTypes.STRING,
            allowNull:false
        },
        phoneNumber:{
            type:DataTypes.STRING,
            allowNull:false
        },
        paymentMethod:{
            type:DataTypes.STRING,
            allowNull:false
        },
        amountPaid:{
            type:DataTypes.STRING,
            allowNull:false
        }
    }
  )
}

export default PaymentModel;