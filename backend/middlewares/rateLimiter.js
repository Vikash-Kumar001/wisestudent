import rateLimit from 'express-rate-limit';

// General API rate limit: 100 requests per minute per IP
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,       // 1 minute
  max: 100,
  message: {
    success: false,
    error: 'Too many requests, please try again later.',
  },
  standardHeaders: true,     // RateLimit-* headers
  legacyHeaders: false,
});

// Stricter limit for auth endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 20,
  message: {
    success: false,
    error: 'Too many login attempts, please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Relaxed limit for read-heavy endpoints (optional)
export const readLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
