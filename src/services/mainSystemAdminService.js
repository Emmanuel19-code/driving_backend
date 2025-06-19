import { tenantModel, userModel } from "../models/index.js";
import { getTenantContext } from "../config/tenantDb.js";
import bcrypt from "bcrypt";
import mysql from "mysql2/promise";
import logger from "../config/logger.js";

export const addNewCompany = async (value) => {
  const { name, email, password, dbDialect = "mysql" } = value;
  // Generate DB name (e.g., 'db_drivesafe')
  const dbName = `db_${name.toLowerCase().replace(/\s+/g, "_")}`;
  const dbUser = process.env.DB_USER;
  const dbPass = process.env.DB_PASS;
  const dbHost = process.env.DB_HOST;
  const dbPort = process.env.DB_PORT || 3306;
  try {
    // 1. Check if tenant name or email already exists
    const existingTenant = await tenantModel.findOne({ where: { name } });
    if (existingTenant) return { success: false, error: "Tenant name already exists" };
    const existingUser = await userModel.findOne({ where: { email } });
    if (existingUser) return { success: false, error: "Email already exists" };
    // 2. Create the tenant's database (if not exists)
    const connection = await mysql.createConnection({
      host: dbHost,
      user: dbUser,
      password: dbPass,
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    // 3. Save tenant in the central "userAccess" DB
    const tenant = await tenantModel.create({
      name,
      dbName,
      dbUser,
      dbPass,
      dbHost,
      dbPort,
      dbDialect,
      status: "active"
    });
    // 4. Hash the admin password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);
    console.log(`this ${password} ,${passwordHash} ${await bcrypt.compare(password,passwordHash)}`)
    // 5. Create an admin user for this tenant
    await userModel.create({
      userName: `${name.replace(/\s+/g, '')}_admin`.toLowerCase(),
      email,
      passwordHash,
      tenantId: tenant.tenantId,
      role: "admin"
    });
    // 6. Sync all tenant-specific models (students, bookings, etc.)
    const { sequelize, models } = await getTenantContext(tenant);
    await sequelize.sync();
    return {
      success: true,
      data: {
        message: "Tenant and admin user created successfully",
        tenantId: tenant.tenantId,
        dbName,
        email,
      },
    };
  } catch (error) {
    logger.error(error)
    return { success: false, error: error.message };
  }
};


//revoking a company access
export const revokeCompanyAccess = async (tenantId) => {
  try {
    const tenant = await tenantModel.findOne({ where: { tenantId } });
    if (!tenant) {
      return { success: false, error: "Tenant not found" };
    }
    if (tenant.status === "inactive") {
      return { success: false, error: "Tenant is already inactive" };
    }
    tenant.status = "inactive";
    await tenant.save();
    return {
      success: true,
      data: { message: "Tenant access revoked successfully" },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to revoke tenant access",
    };
  }
};


export const getAllAddedCompanies = async () => {
  try {
    const tenants = await tenantModel.findAll({
      attributes: { exclude: ["dbPass"] }, 
      order: [["createdAt", "DESC"]],
    });
    return {
      success: true,
      data: tenants,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to fetch registered companies",
    };
  }
};