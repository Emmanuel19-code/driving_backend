// models/Tenant.js
import { DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";

const TenantModel = (sequelize) =>
  sequelize.define("Tenant", {
    tenantId: {
      type: DataTypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // each tenant name must be unique
    },
    dbName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dbUser: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dbPass: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dbHost: {
      type: DataTypes.STRING,
      defaultValue: "localhost",
    },
    dbPort: {
      type: DataTypes.INTEGER,
      defaultValue: 3306,
    },
    dbDialect: {
      type: DataTypes.ENUM("mysql", "postgres", "mssql"),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
    },
  }, {
    tableName: "tenants",
    timestamps: true,
  });

export default TenantModel;
