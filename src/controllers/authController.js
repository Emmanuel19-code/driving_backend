import logger from "../config/logger.js";
import { handleRefreshTokenService, loginUserService, logoutUserService } from "../services/authService.js";

export const accessSystem = async (req, res) => {
  const { userName, password } = req.body;
  if (!userName || !password) {
    return res.status(400).json({
      success: false,
      error: "Email and password are required",
    });
  }
  const response = await loginUserService({ userName, password });
  if (!response.success) {
    return res.status(401).json({
      success: false,
      error: response.error,
    });
  }
  return res.status(200).json({
    success: true,
    data: response.data,
  });
};

export const refreshTokenController = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    const result = await handleRefreshTokenService(refreshToken);
    if (!result.success) {
      return res.status(result.status).json({ message: result.message });
    }
    return res.json({ accessToken: result.accessToken });
  } catch (error) {
    logger.error(error)
    return res.status(500).json({
      msg:"Internal Server error"
    })
  }
};


export const logoutController = async (req, res) => {
  const result = await logoutUserService(req, res);
  if (!result.success) {
    return res.status(result.status).json({
      success: false,
      error: result.message || "Logout failed",
    });
  }
  return res.status(result.status).json({
    success: true,
    message: result.message,
  });
};