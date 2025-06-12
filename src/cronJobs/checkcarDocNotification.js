import { Op } from "sequelize";
import logger from "../config/logger.js";
import { carDocModel } from "../models/index.js";

const checkCarDocNotification = async () =>{
  console.log('[CRON] Starting car document check job...');
  try {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    // === 1. Upcoming Expiry ===
    const upcomingDocs = await carDocModel.findAll({
      where: {
        expiryDate: { [Op.between]: [today, nextWeek] },
        renewed: false,
        notified: false
      }
    });

    for (const doc of upcomingDocs) {
      try {
        await Notification.create({
          userId: doc.carRegistrationNumber, // Adjust if you have actual userId
          title: `Upcoming Expiry: ${doc.documentType}`,
          message: `The ${doc.documentType} for car ${doc.carRegistrationNumber} will expire on ${doc.expiryDate.toDateString()}.`,
          type: 'car-document'
        });

        doc.notified = true;
        await doc.save();
      } catch (innerErr) {
        logger.error(innerErr.message)
        console.error(`Error sending notification for upcoming doc ${doc.docId}:`, innerErr.message);
      }
    }

    // === 2. Already Expired ===
    const expiredDocs = await carDocModel.findAll({
      where: {
        expiryDate: { [Op.lt]: today },
        renewed: false,
        notified: false
      }
    });

    for (const doc of expiredDocs) {
      try {
        await Notification.create({
          userId: doc.carRegistrationNumber,
          title: `Expired Document: ${doc.documentType}`,
          message: `The ${doc.documentType} for car ${doc.carRegistrationNumber} expired on ${doc.expiryDate.toDateString()} and hasn't been renewed.`,
          type: 'car-document'
        });

        doc.notified = true;
        await doc.save();
      } catch (innerErr) {
        logger.error(innerErr.message)
        console.error(`Error sending notification for expired doc ${doc.docId}:`, innerErr.message);
      }
    }
    console.log(`[CRON] Completed: Upcoming (${upcomingDocs.length}), Expired (${expiredDocs.length})`);
  } catch (err) {
    logger.error(err)
    console.error('[CRON ERROR] Failed to run car document notification job:', err.message);
  }
};

export default checkCarDocNotification;