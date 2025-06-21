import { Sequelize } from "sequelize";
import { registerModels } from "../models/index.js";
import logger from "./logger.js";


const tenantCache = new Map();

export const getTenantContext = async (tenant) => {
  const {
    tenantId, dbName, dbUser, dbPass, dbHost, dbPort = 3306, dbDialect
  } = tenant;
  if (tenantCache.has(tenantId)) {
    return tenantCache.get(tenantId);
  }
  const sequelize = new Sequelize(dbName, dbUser, dbPass, {
    host: dbHost,
    port: dbPort,
    dialect: dbDialect,
    logging: false,
  });
  try {
    await sequelize.authenticate();

    const models = registerModels(sequelize); // ⬅️ your tenant-specific models here
    await sequelize.sync(); // auto-create tables if not already there

    const context = { sequelize, models };
    tenantCache.set(tenantId, context);

    return context;
  } catch (err) {
    logger.error(err)
    throw new Error("Could not connect to tenant DB: " + err.message);
  }
};
