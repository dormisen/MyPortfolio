// routes/Adminroute.js - ENHANCED VERSION
import { Router } from 'express';
const router = Router();
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { body, validationResult } from 'express-validator';
import { Protect, sessionManager, tokenManager } from '../Middleware/Auth.js';
import { createRateLimit, getRateLimitConfig } from '../Middleware/security.js';

// Enhanced login validation
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address')
    .isLength({ max: 255 })
    .escape()
    .customSanitizer(email => email.toLowerCase()),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .isLength({ max: 128 })
    .escape()
];

// rate limiting configuration
const rateLimitConfig = getRateLimitConfig();

// Login rate limiting with IP-based tracking
const loginAttempts = new Map();

const loginRateLimit = createRateLimit(
  rateLimitConfig.auth.windowMs, 
  rateLimitConfig.auth.max, 
  'Too many login attempts. Please try again later.',
  [(req) => {
    // Skip rate limiting for successful logins from same IP
    const ip = req.ip;
    const attempts = loginAttempts.get(ip) || 0;
    return attempts < 10; // More generous for IP-based tracking
  }]
);

// Enhanced admin login
router.post('/login', loginRateLimit, loginValidation, async (req, res) => {
  const requestId = req.headers['x-request-id'] || generateRequestId();
  const ip = req.ip;
  const userAgent = req.get('User-Agent');

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array(),
        code: "VALIDATION_ERROR",
        requestId
      });
    }

    const { email, password } = req.body;

    // Track login attempts
    const attemptKey = `${ip}-${email}`;
    const attempts = loginAttempts.get(attemptKey) || 0;
    
    if (attempts >= 5) {
      return res.status(429).json({ 
        error: 'Too many login attempts. Please try again later.',
        code: "RATE_LIMITED",
        requestId
      });
    }

    // Enhanced admin authentication
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error('Admin credentials not configured');
      return res.status(500).json({ 
        error: 'Server configuration error',
        code: "SERVER_ERROR",
        requestId
      });
    }

    // Timing-safe comparison with additional security
    let credentialsValid = false;
    
    try {
      // Normalize inputs for comparison
      const normalizedInputEmail = email.toLowerCase().trim();
      const normalizedStoredEmail = adminEmail.toLowerCase().trim();
      
      credentialsValid = 
        crypto.timingSafeEqual(
          Buffer.from(normalizedInputEmail, 'utf8'), 
          Buffer.from(normalizedStoredEmail, 'utf8')
        ) && 
        crypto.timingSafeEqual(
          Buffer.from(password, 'utf8'), 
          Buffer.from(adminPassword, 'utf8')
        );
    } catch (compareError) {
      credentialsValid = false;
    }

    // Artificial delay to prevent timing attacks (1000-2000ms)
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    if (!credentialsValid) {
      // Increment attempt counter
      loginAttempts.set(attemptKey, attempts + 1);
      
      // Reset counter after 15 minutes
      setTimeout(() => {
        loginAttempts.delete(attemptKey);
      }, 15 * 60 * 1000);

      console.warn(`Failed login attempt for: ${email} from IP: ${ip}`);
      
      return res.status(401).json({ 
        error: 'Invalid credentials',
        code: "INVALID_CREDENTIALS",
        requestId
      });
    }

    // Clear attempt counter on successful login
    loginAttempts.delete(attemptKey);

    // Create secure session
    const session = sessionManager.createSession('admin', userAgent, ip);
    
    // Generate enhanced JWT token
    const token = jwt.sign(
      { 
        userId: 'admin', 
        email: adminEmail,
        role: 'admin',
        sessionId: session.sessionId,
        iss: 'portfolio-app',
        aud: 'portfolio-app-users',
        jti: session.sessionId
      },
      process.env.JWT_SECRET,
      { 
        expiresIn: '24h',
        algorithm: 'HS256',
        notBefore: 0
      }
    );

    // Secure cookie settings
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/'
    };

    if (process.env.NODE_ENV === 'production') {
      res.cookie('auth_token', token, cookieOptions);
    }

    res.json({
      token,
      admin: { 
        id: 'admin', 
        email: adminEmail, 
        role: 'admin',
        sessionId: session.sessionId,
        permissions: ['read:projects', 'write:projects', 'delete:projects']
      },
      expiresIn: '24h',
      sessionInfo: {
        userAgent: session.userAgent,
        ip: session.ip,
        createdAt: session.createdAt
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ 
      error: 'Authentication server error',
      code: "SERVER_ERROR",
      requestId
    });
  }
});

// Enhanced token refresh endpoint
router.post('/refresh', async (req, res) => {
  const requestId = req.headers['x-request-id'] || generateRequestId();
  
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Refresh token required',
        code: "NO_REFRESH_TOKEN",
        requestId
      });
    }

    const oldToken = authHeader.split(' ')[1];
    
    // Verify old token
    const decoded = jwt.verify(oldToken, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
      ignoreExpiration: true // Allow expired tokens for refresh
    });

    // Verify session is still active
    const session = sessionManager.getSession(decoded.sessionId);
    if (!session || !session.isActive) {
      return res.status(401).json({
        error: 'Session expired',
        code: "SESSION_EXPIRED",
        requestId
      });
    }

    // Generate new token
    const newToken = jwt.sign(
      { 
        ...decoded,
        iat: Math.floor(Date.now() / 1000) // New issue time
      },
      process.env.JWT_SECRET,
      { 
        expiresIn: '24h',
        algorithm: 'HS256'
      }
    );

    res.json({
      token: newToken,
      admin: {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        sessionId: decoded.sessionId
      }
    });

  } catch (err) {
    console.error('Token refresh error:', err);
    res.status(401).json({
      error: 'Token refresh failed',
      code: "REFRESH_FAILED",
      requestId
    });
  }
});

// Enhanced logout
router.post('/logout', Protect, async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (token) {
      tokenManager.addToBlacklist(token);
    }

    // Revoke session
    if (req.user?.sessionId) {
      sessionManager.revokeSession(req.user.sessionId);
    }

    // Clear cookie
    res.clearCookie('auth_token');

    res.json({ 
      success: true,
      message: 'Logged out successfully' 
    });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ error: 'Logout failed' });
  }
});

// Session management endpoints
router.get('/sessions', Protect, (req, res) => {
  const userSessions = Array.from(sessionManager.activeSessions.entries())
    .filter(([_, session]) => session.userId === req.user.id)
    .map(([sessionId, session]) => ({
      sessionId,
      userAgent: session.userAgent,
      ip: session.ip,
      createdAt: session.createdAt,
      lastActive: session.lastActive,
      current: session.sessionId === req.user.sessionId
    }));

  res.json({ sessions: userSessions });
});

router.delete('/sessions/:sessionId', Protect, (req, res) => {
  const { sessionId } = req.params;
  
  if (sessionId === req.user.sessionId) {
    return res.status(400).json({ error: 'Cannot revoke current session' });
  }

  sessionManager.revokeSession(sessionId);
  res.json({ success: true, message: 'Session revoked' });
});

// Enhanced verify endpoint
router.get('/verify', Protect, (req, res) => {
  try {
    res.json({
      admin: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
        sessionId: req.user.sessionId
      },
      permissions: ['read:projects', 'write:projects', 'delete:projects'],
      sessionValid: true,
      environment: process.env.NODE_ENV,
      serverTime: new Date().toISOString()
    });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(401).json({ error: 'Session verification failed' });
  }
});

// Helper function
function generateRequestId() {
  return `req_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
}

export default router;