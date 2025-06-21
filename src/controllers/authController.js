import { loginUserService } from "../services/authService.js";

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
