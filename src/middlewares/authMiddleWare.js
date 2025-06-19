import jwt from "jsonwebtoken";
import logger from "../config/logger.js";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: "Unauthorized: No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    logger.error(err)
    console.error("JWT verification failed:", err.message);
    return res.status(401).json({ success: false, error: "Unauthorized: Invalid token" });
  }
};
