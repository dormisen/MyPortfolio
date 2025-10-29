// middleware/security.js - Remove verify-specific rate limiting
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'mongo-sanitize';
import hpp from 'hpp';
import crypto from 'crypto';

// Environment-aware rate limiting configuration
export const getRateLimitConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isTest = process.env.NODE_ENV === 'test';
  
  if (isTest) {
    return {
      general: { windowMs: 60000, max: 10000 },
      auth: { windowMs: 60000, max: 100 },
      strict: { windowMs: 60000, max: 1000 }
    };
  }
  
  if (isDevelopment) {
    return {
      general: { windowMs: 60000, max: 1000 },
      auth: { windowMs: 60000, max: 20 },
      strict: { windowMs: 30000, max: 50 }
    };
  }
  
  // Production
  return {
    general: { windowMs: 900000, max: 100 },
    auth: { windowMs: 900000, max: 5 },
    strict: { windowMs: 300000, max: 10 }
  };
};

// rate limiting
export const createRateLimit = (windowMs, max, message, skipConditions = []) => {
  return rateLimit({
    windowMs,
    max,
    message: { error: message },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
      return req.user?.id || req.ip || req.connection.remoteAddress;
    },
    handler: (req, res) => {
      res.status(429).json({
        error: 'Too many requests',
        message,
        retryAfter: Math.ceil(windowMs / 1000),
        code: "RATE_LIMITED"
      });
    },
    skip: (req) => {
      // Skip for health checks
      if (req.url === '/health') return true;
      
      // Skip based on custom conditions
      for (const condition of skipConditions) {
        if (condition(req)) return true;
      }
      
      return false;
    }
  });
};

// Security headers middleware
export const securityHeaders = (req, res, next) => {
  // Generate nonce for CSP
  res.locals.nonce = crypto.randomBytes(16).toString('base64');
  
  // Set security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  res.setHeader('X-Request-ID', req.headers['x-request-id'] || generateRequestId());
  
  next();
};

// Input sanitization middleware
export const inputSanitization = (req, res, next) => {
  if (req.body) req.body = mongoSanitize(req.body);
  if (req.query) req.query = mongoSanitize(req.query);
  if (req.params) req.params = mongoSanitize(req.params);
  
  // Prevent parameter pollution
  next();
};

// Request ID generator
export const generateRequestId = () => {
  return `req_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
};

// CSRF protection (simplified version)
export const csrfProtection = (req, res, next) => {
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    const csrfToken = req.headers['x-csrf-token'];
    const sessionToken = req.session?.csrfToken;
    
    if (!csrfToken || csrfToken !== sessionToken) {
      return res.status(403).json({
        error: 'CSRF token validation failed',
        code: 'CSRF_ERROR'
      });
    }
  }
  next();
};