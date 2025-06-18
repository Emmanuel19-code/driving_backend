import { DataTypes } from "sequelize";

const auditTrailModel = (sequelize) => {
  const auditTrail = sequelize.define(
    "AuditTrail",
    {
      user_id: {
        type: DataTypes.INTEGER,
      },
      action: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      table_name: {
        type: DataTypes.STRING,
      },
      record_id: {
        type: DataTypes.INTEGER,
      },
      description: {
        type: DataTypes.TEXT,
      },
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "auditTrails",
      timestamps: false,
    }
  );
  return auditTrail;
};

export default auditTrailModel;
