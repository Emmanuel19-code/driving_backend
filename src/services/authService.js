// services/authService.js
import { userModel, tenantModel } from "../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import logger from "../config/logger.js";

export const loginUserService = async ({ userName, password }, res) => {
  try {
    const user = await userModel.findOne({ where: { userName } });
    if (!user) {
      return { success: false, error: "Invalid userName or password" };
    }
    // 2. Validate password
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return { success: false, error: "Authentication failed" };
    }
    // 3. Fetch tenant
    const tenant = await tenantModel.findOne({ where: { tenantId: user.tenantId } });
    if (!tenant) {
      return { success: false, error: "Associated tenant not found" };
    }
    // 4. Generate Access Token (short-lived)
    const accessToken = jwt.sign(
      {
        userId: user.id,
        tenantId: user.tenantId,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );
    // 5. Generate Refresh Token (long-lived)
    const refreshToken = jwt.sign(
      {
        userId: user.id,
        tenantId: user.tenantId,
        role: user.role,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
    // 6. Set refresh token in HttpOnly secure cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return {
      success: true,
      data: {
        accessToken,
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
    logger.error("Login error:", error);
    return { success: false, error: error.message };
  }
};



export const handleRefreshTokenService = async (refreshToken) => {
  try {
    if (!refreshToken) {
      return { success: false, status: 401, message: "No refresh token provided" };
    }
    // Verify the refresh token
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    // Generate new access token
    const newAccessToken = jwt.sign(
      {
        userId: payload.userId,
        tenantId: payload.tenantId,
        role: payload.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    return {
      success: true,
      accessToken: newAccessToken,
    };
  } catch (err) {
    logger.error("Refresh token error: ", err.message);
    return {
      success: false,
      status: 403,
      message: "Invalid or expired refresh token",
    };
  }
};


// /services/auth/logoutService.js

export const logoutUserService = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return { success: false, status: 204, message: "No token found" };
    }
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return { success: true, status: 200, message: "Logged out successfully" };
  } catch (error) {
    logger.error(error)
    return { success: false, status: 500, message: error.message };
  }
};
