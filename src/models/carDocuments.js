import { DataTypes } from "sequelize";

const carDocumentSchema = (sequelize) => {
  const CarDocs = sequelize.define(
    "CarDocs",
    {
      docId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      carRegistrationNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      documentType: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "e.g. Insurance, Road Worthiness, Registration",
      },
      expiryDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "Optional expiry date for documents like insurance",
      },
      notified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      renewed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "Car_Docs",
      timestamps: true,
    }
  );

  return CarDocs;
};

export default carDocumentSchema;
