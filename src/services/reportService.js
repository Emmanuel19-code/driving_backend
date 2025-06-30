import { Op, fn, col, literal } from "sequelize";
import logger from "../config/logger.js";

export const getSummaryReport = async (models) => {
  try {
    const {
      studentIdCounter,
      instructorModel,
      paymentModel,
      studentChosenService,
      carModel,
      fuelmodel,
      expenseModel, 
    } = models;

    const years = await studentIdCounter.findAll({
      attributes: ["year"],
      raw: true,
    });

    const result = {};

    for (const { year } of years) {
      const [studentData, instructorData, totalCars, fuelLogs,  payments, studentServices] =
        await Promise.all([
          studentIdCounter.findOne({ where: { year }, raw: true }),
          instructorModel.findAll({
            where: {
              createdAt: {
                [Op.gte]: new Date(`${year}-01-01`),
                [Op.lte]: new Date(`${year}-12-31`),
              },
            },
          }),
          carModel.count(),
          fuelmodel.findAll({ raw: true }),
          paymentModel.findAll({ raw: true }),
          studentChosenService.findAll({ raw: true }),
        ]);

      const fuelByCar = {};
      let totalFuel = 0;

      for (const fuel of fuelLogs) {
        const logYear = new Date(fuel.createdAt).getFullYear().toString();
        if (logYear !== year) continue;

        const reg = fuel.carRegistrationNumber;
        const amt = parseFloat(fuel.amountloaded || 0);
        const litres = parseFloat(fuel.litres || 0);

        totalFuel += amt;
        if (!fuelByCar[reg]) fuelByCar[reg] = { amount: 0, litres: 0 };
        fuelByCar[reg].amount += amt;
        fuelByCar[reg].litres += litres;
      }

      const revenue = payments
        .filter((p) => new Date(p.createdAt).getFullYear().toString() === year)
        .reduce((sum, p) => sum + parseFloat(p.amountPaid || 0), 0);

      //const expense = expenses
      //  .filter((e) => new Date(e.createdAt).getFullYear().toString() === year)
      //  .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);

      const pendingAmount = studentServices
        .filter((scs) => new Date(scs.createdAt).getFullYear().toString() === year)
        .reduce((sum, scs) => {
          const total = parseFloat(scs.total || 0);
          const paid = parseFloat(scs.amountPaid || 0);
          return sum + (total - paid);
        }, 0);

      result[year] = {
        students: studentData?.total || 0,
        male: studentData?.male || 0,
        female: studentData?.female || 0,
        instructors: instructorData?.length || 0,
        revenue,
       // expense,
        pending: pendingAmount,
        cars: totalCars,
        fuel: totalFuel,
        fuelByCar,
      };
    }
    return result;
  } catch (error) {
    logger.error(error)
    throw new Error(`Failed to generate report: ${error.message}`);
  }
};

