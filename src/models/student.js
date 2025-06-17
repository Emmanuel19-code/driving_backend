import { DataTypes } from "sequelize";

const StudentModel = (sequelize, StudentIdCounter) => {
  const Student = sequelize.define(
    "Student",
    {
      studentId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      otherName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gender: {
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
        allowNull: true,
      },
      phoneTwo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      amountOwing: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      amountPaid: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
      },
    },
    {
      tableName: "students",
      timestamps: true,
    }
  );

  // HOOK: Assign studentId and update year-gender stats
  Student.beforeCreate(async (student) => {
    const year = new Date().getFullYear().toString();
    const gender = student.gender?.toLowerCase();

    // Find or create year counter
    const [counter, created] = await StudentIdCounter.findOrCreate({
      where: { year },
      defaults: {
        year,
        total: 1,
        male: gender === "male" ? 1 : 0,
        female: gender === "female" ? 1 : 0,
      },
    });

    if (!created) {
      counter.total += 1;
      if (gender === "male") counter.male += 1;
      if (gender === "female") counter.female += 1;
      await counter.save();
    }

    // Generate student ID like STU2025-0005
    const padded = String(counter.total).padStart(4, "0");
    student.studentId = `STU${year}-${padded}`;
  });

  return Student;
};

export default StudentModel;
