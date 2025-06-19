// services/authService.js
import { userModel, tenantModel } from "../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import logger from "../config/logger.js";

export const loginUserService = async ({ userName, password }) => {
  try {
    const user = await userModel.findOne({ where: { userName } });
    if (!user) {
      return { success: false, error: "Invalid userName or password" };
    }
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return { success: false, error: "Authentication failed" };
    }
    // Fetch tenant info
    const tenant = await tenantModel.findOne({ where: { tenantId: user.tenantId } });
    if (!tenant) {
      return { success: false, error: "Associated tenant not found" };
    }
    // Create token
    const token = jwt.sign(
      {
        userId: user.id,
        tenantId: user.tenantId,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    return {
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.fullname,
          userName: user.userName,
          role: user.role,
        },
        tenant: {
          name: tenant.name,
          tenantId: tenant.tenantId,
        },
      },
    };
  } catch (error) {
    logger.error(error)
    return { success: false, error: error.message };
  }
};
