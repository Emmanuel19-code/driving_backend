import { DataTypes } from 'sequelize';


const InstructorModel = (sequelize,InstructorIdCounter) => {
  const Staff = sequelize.define('Staff', {
    staffId: {
      type: DataTypes.STRING,
    },
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
  }, {
    tableName: 'staff',
    timestamps: true,
  });

 
  Staff.beforeCreate(async (staff, options) => {
    const year = new Date().getFullYear().toString();

    const [counter, created] = await InstructorIdCounter.findOrCreate({
      where: { year },
      defaults: { count: 1 },
    });

    if (!created) {
      counter.count += 1;
      await counter.save();
    }

    const padded = String(counter.count).padStart(3, '0');
    staff.staffId = `STAFF${year}-${padded}`;
  });

  return Staff;
};

export default InstructorModel;
