import rateLimit from "express-rate-limit";

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  message: {
    success: false,
    error: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,  // Disable the `X-RateLimit-*` headers
});


//This is used to track failed attempts
export const failedAttemptLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 failed attempts per IP
  message: {
    success: false,
    error: "Too many failed attempts. Please try again after 15 minutes.",
  },
  skipSuccessfulRequests: true, 
  standardHeaders: true,
  legacyHeaders: false,
});
