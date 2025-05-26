import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const InstructorIdCounter = sequelize.define('InstructorIdCounter', {
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

export default InstructorIdCounter;
