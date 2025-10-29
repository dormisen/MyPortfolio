// middleware/Auth.js - FIXED VERSION
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Enhanced session management
const activeSessions = new Map();
const tokenBlacklist = new Set();

export const sessionManager = {
  createSession: (userId, userAgent, ip) => {
    const sessionId = crypto.randomBytes(32).toString('hex');
    const session = {
      sessionId,
      userId,
      userAgent,
      ip,
      createdAt: new Date(),
      lastActive: new Date(),
      isActive: true
    };
    
    activeSessions.set(sessionId, session);
    return session;
  },

  getSession: (sessionId) => {
    return activeSessions.get(sessionId);
  },

  revokeSession: (sessionId) => {
    activeSessions.delete(sessionId);
  },

  revokeAllUserSessions: (userId) => {
    for (const [sessionId, session] of activeSessions.entries()) {
      if (session.userId === userId) {
        activeSessions.delete(sessionId);
      }
    }
  },

  // ADD THIS: Get all active sessions (needed for Adminroute.js)
  get activeSessions() {
    return activeSessions;
  }
};

// Enhanced token management
export const tokenManager = {
  addToBlacklist: (token) => {
    const decoded = jwt.decode(token);
    if (decoded && decoded.exp) {
      // Auto-remove from blacklist after expiration
      const expiresIn = decoded.exp * 1000 - Date.now();
      if (expiresIn > 0) {
        tokenBlacklist.add(token);
        setTimeout(() => {
          tokenBlacklist.delete(token);
        }, expiresIn);
      }
    }
  },

  isTokenBlacklisted: (token) => {
    return tokenBlacklist.has(token);
  }
};

// Enhanced protect middleware
export const Protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const requestId = req.headers['x-request-id'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: "Access denied. No token provided.",
      code: "NO_TOKEN",
      requestId
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Check if token is blacklisted
    if (tokenManager.isTokenBlacklisted(token)) {
      return res.status(401).json({ 
        error: "Token invalidated. Please login again.",
        code: "TOKEN_INVALIDATED",
        requestId
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
      maxAge: '24h'
    });

    // Verify session is still active
    const session = sessionManager.getSession(decoded.sessionId);
    if (!session || !session.isActive) {
      return res.status(401).json({ 
        error: "Session expired or invalid.",
        code: "SESSION_EXPIRED",
        requestId
      });
    }

    // Update last activity
    session.lastActive = new Date();

    let user;
    if (decoded.userId === 'admin') {
      user = {
        id: 'admin',
        email: process.env.ADMIN_EMAIL,
        role: 'admin',
        sessionId: decoded.sessionId,
        permissions: ['read:projects', 'write:projects', 'delete:projects']
      };
    } else {
      // Handle database admins if needed
      return res.status(401).json({ 
        error: "Invalid user account",
        code: "INVALID_ACCOUNT",
        requestId
      });
    }

    req.user = user;
    req.session = session;
    next();
  } catch (err) {
    console.error('Auth error:', err);

    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: "Token expired", 
        code: "TOKEN_EXPIRED",
        requestId 
      });
    }

    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: "Invalid token", 
        code: "INVALID_TOKEN",
        requestId 
      });
    }

    res.status(401).json({ 
      error: "Authentication failed", 
      code: "AUTH_FAILED",
      requestId 
    });
  }
};