import { Op } from "sequelize";
import logger from "../config/logger.js";
import { getTenantContext } from "../config/tenantDb.js";
import { registerModels } from "../models/index.js";
import { tenantModel } from "../models/index.js"; // centralized tenant model

const checkCarDocNotification = async () => {
  console.log("[CRON] Starting car document check job...");
  try {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const activeTenants = await tenantModel.findAll({ where: { status: "active" } });

    for (const tenant of activeTenants) {
      try {
        const { sequelize, models } = await getTenantContext(tenant);
        const { carDocModel, Notification } = registerModels(sequelize);

        // === 1. Upcoming Expiry ===
        const upcomingDocs = await carDocModel.findAll({
          where: {
            expiryDate: { [Op.between]: [today, nextWeek] },
            renewed: false,
            notified: false,
          },
        });

        for (const doc of upcomingDocs) {
          await Notification.create({
            userId: doc.carRegistrationNumber,
            title: `Upcoming Expiry: ${doc.documentType}`,
            message: `The ${doc.documentType} for car ${doc.carRegistrationNumber} will expire on ${doc.expiryDate.toDateString()}.`,
            type: "car-document",
          });

          doc.notified = true;
          await doc.save();
        }

        // === 2. Already Expired ===
        const expiredDocs = await carDocModel.findAll({
          where: {
            expiryDate: { [Op.lt]: today },
            renewed: false,
            notified: false,
          },
        });

        for (const doc of expiredDocs) {
          await Notification.create({
            userId: doc.carRegistrationNumber,
            title: `Expired Document: ${doc.documentType}`,
            message: `The ${doc.documentType} for car ${doc.carRegistrationNumber} expired on ${doc.expiryDate.toDateString()} and hasn't been renewed.`,
            type: "car-document",
          });

          doc.notified = true;
          await doc.save();
        }

        console.log(`[TENANT: ${tenant.name}] Notifications sent: Upcoming (${upcomingDocs.length}), Expired (${expiredDocs.length})`);
      } catch (tenantErr) {
        logger.error(`[TENANT ERROR] ${tenant.name}: ${tenantErr.message}`);
      }
    }

    console.log("[CRON] Completed car document check job for all tenants");
  } catch (err) {
    logger.error(err);
    console.error("[CRON ERROR] Failed to run car document notification job:", err.message);
  }
};

export default checkCarDocNotification;
