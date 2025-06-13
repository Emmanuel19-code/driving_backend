import { DataTypes } from 'sequelize';

const InstructorIdCounterModel = (sequelize) => {
  return sequelize.define('InstructorIdCounter', {
    year: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
  }, {
    tableName: 'instructor_id_counters',
    timestamps: false,
  });
};

export default InstructorIdCounterModel;

