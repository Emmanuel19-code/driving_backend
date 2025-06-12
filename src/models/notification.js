import { DataTypes } from "sequelize";

const notificationSchema = (sequelize) => {
  const notice = sequelize.define(
    "notifications",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        defaultValue: "system",
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "notifications",
      timestamps: true,
    }
  );
  return notice;
};

export default notificationSchema;