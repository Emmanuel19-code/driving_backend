import { DataTypes } from "sequelize";

const InstructorModel = (sequelize) => {
  return sequelize.define(
    'Instructor',
    {
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      phoneOne: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phoneTwo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      Role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'instructor',
      timestamps: true,
    }
  );
};

export default InstructorModel;
