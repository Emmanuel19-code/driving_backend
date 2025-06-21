import { DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";

const UserModel = (sequelize) =>
  sequelize.define("User", {
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true,
    },
    userName:{
        type:DataTypes.STRING,
        unique:true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    passwordHash: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    tenantId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "staff", "student"),
      defaultValue: "staff",
    },
  }, {
    tableName: "users",
    timestamps: true,
  });

export default UserModel;
