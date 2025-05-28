import { DataTypes } from 'sequelize';

const StudentIdCounterModel = (sequelize) => {
  return sequelize.define('StudentIdCounter', {
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
    tableName: 'student_id_counters',
    timestamps: false,
  });
};

export default StudentIdCounterModel;

