import { DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";

const PaymentModel = (sequelize) => {
  const Payment = sequelize.define(
    "Payments",
    {
      paymentId: {
        type: DataTypes.STRING,
        unique: true,
      },
      paidBy: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amountPaid: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      hooks: {
        beforeCreate: (payment) => {
          payment.paymentId = `PAY-${Date.now()}-${uuidv4().slice(0, 8)}`;
        },
      },
    }
  );

  return Payment;
};

export default PaymentModel;
