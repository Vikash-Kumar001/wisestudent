import rateLimit from 'express-rate-limit';

// General API rate limit: 100 requests per minute per IP
// keyGenerator uses req.ip which correctly extracts client IP from X-Forwarded-For
// when trust proxy is set to 1 (single reverse proxy)
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,       // 1 minute
  max: 100,
  message: {
    success: false,
    error: 'Too many requests, please try again later.',
  },
  standardHeaders: true,     // RateLimit-* headers
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use req.ip which is automatically set from X-Forwarded-For when trust proxy = 1
    // This ensures accurate client IP identification behind Nginx reverse proxy
    return req.ip || req.socket.remoteAddress;
  },
});

// Stricter limit for auth endpoints
// Uses same keyGenerator to ensure consistent IP identification
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 20,
  message: {
    success: false,
    error: 'Too many login attempts, please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use req.ip which is automatically set from X-Forwarded-For when trust proxy = 1
    // This ensures accurate client IP identification behind Nginx reverse proxy
    return req.ip || req.socket.remoteAddress;
  },
});

// Relaxed limit for read-heavy endpoints (optional)
// Uses same keyGenerator to ensure consistent IP identification
export const readLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use req.ip which is automatically set from X-Forwarded-For when trust proxy = 1
    // This ensures accurate client IP identification behind Nginx reverse proxy
    return req.ip || req.socket.remoteAddress;
  },
});
