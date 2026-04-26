import CryptoJS from 'crypto-js';
import { auth } from '../firebaseConfig';

/**
 * Security Service for data encryption, audit trails, and compliance
 */
class SecurityService {
  constructor() {
    this.encryptionKey = process.env.REACT_APP_ENCRYPTION_KEY || 'default-key-change-in-production';
    this.auditLog = [];
    this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
    this.maxLoginAttempts = 5;
    this.loginAttempts = new Map();
  }

  /**
   * Encrypt sensitive data
   */
  encrypt(data) {
    try {
      const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), this.encryptionKey).toString();
      return encrypted;
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  /**
   * Decrypt sensitive data
   */
  decrypt(encryptedData) {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  /**
   * Hash sensitive data (one-way)
   */
  hash(data) {
    return CryptoJS.SHA256(data).toString();
  }

  /**
   * Generate secure random token
   */
  generateToken(length = 32) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Log audit events
   */
  logAuditEvent(event) {
    const auditEntry = {
      id: this.generateToken(16),
      timestamp: new Date().toISOString(),
      userId: auth.currentUser?.uid || 'anonymous',
      userEmail: auth.currentUser?.email || 'unknown',
      action: event.action,
      resource: event.resource,
      resourceId: event.resourceId,
      details: event.details,
      ipAddress: this.getClientIP(),
      userAgent: navigator.userAgent,
      sessionId: this.getSessionId(),
    };

    this.auditLog.push(auditEntry);

    // Store in localStorage for persistence (in production, send to secure backend)
    this.persistAuditLog(auditEntry);

    console.log('🔍 Audit Event:', auditEntry);
    return auditEntry;
  }

  /**
   * Persist audit log to storage
   */
  persistAuditLog(entry) {
    try {
      const existingLogs = JSON.parse(localStorage.getItem('audit_logs') || '[]');
      existingLogs.push(entry);

      // Keep only last 1000 entries
      if (existingLogs.length > 1000) {
        existingLogs.splice(0, existingLogs.length - 1000);
      }

      localStorage.setItem('audit_logs', JSON.stringify(existingLogs));
    } catch (error) {
      console.error('Failed to persist audit log:', error);
    }
  }

  /**
   * Get audit logs
   */
  getAuditLogs(filters = {}) {
    try {
      const logs = JSON.parse(localStorage.getItem('audit_logs') || '[]');

      let filteredLogs = logs;

      if (filters.userId) {
        filteredLogs = filteredLogs.filter(log => log.userId === filters.userId);
      }

      if (filters.action) {
        filteredLogs = filteredLogs.filter(log => log.action === filters.action);
      }

      if (filters.startDate) {
        filteredLogs = filteredLogs.filter(
          log => new Date(log.timestamp) >= new Date(filters.startDate)
        );
      }

      if (filters.endDate) {
        filteredLogs = filteredLogs.filter(
          log => new Date(log.timestamp) <= new Date(filters.endDate)
        );
      }

      return filteredLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } catch (error) {
      console.error('Failed to get audit logs:', error);
      return [];
    }
  }

  /**
   * Validate user permissions
   */
  hasPermission(user, action, resource) {
    if (!user || !user.roleInfo) {
      return false;
    }

    const permissions = {
      admin: ['*'],
      tutor: [
        'students:read',
        'students:write',
        'attendance:read',
        'attendance:write',
        'billing:read',
        'billing:write',
        'reports:read',
      ],
      viewer: ['students:read', 'attendance:read', 'reports:read'],
    };

    const userRole = user.roleInfo.role || 'viewer';
    const userPermissions = permissions[userRole] || [];

    // Admin has all permissions
    if (userPermissions.includes('*')) {
      return true;
    }

    // Check specific permission
    const permission = `${resource}:${action}`;
    return userPermissions.includes(permission);
  }

  /**
   * Rate limiting for login attempts
   */
  checkLoginAttempts(email) {
    const attempts = this.loginAttempts.get(email) || { count: 0, lastAttempt: 0 };
    const now = Date.now();

    // Reset attempts after 15 minutes
    if (now - attempts.lastAttempt > 15 * 60 * 1000) {
      attempts.count = 0;
    }

    if (attempts.count >= this.maxLoginAttempts) {
      const timeLeft = 15 * 60 * 1000 - (now - attempts.lastAttempt);
      throw new Error(
        `Too many login attempts. Try again in ${Math.ceil(timeLeft / 60000)} minutes.`
      );
    }

    return true;
  }

  /**
   * Record failed login attempt
   */
  recordFailedLogin(email) {
    const attempts = this.loginAttempts.get(email) || { count: 0, lastAttempt: 0 };
    attempts.count++;
    attempts.lastAttempt = Date.now();
    this.loginAttempts.set(email, attempts);

    this.logAuditEvent({
      action: 'login_failed',
      resource: 'authentication',
      resourceId: email,
      details: { attemptCount: attempts.count },
    });
  }

  /**
   * Clear login attempts on successful login
   */
  clearLoginAttempts(email) {
    this.loginAttempts.delete(email);
  }

  /**
   * Session management
   */
  initializeSession() {
    const sessionId = this.generateToken(32);
    const sessionData = {
      id: sessionId,
      startTime: Date.now(),
      lastActivity: Date.now(),
      userId: auth.currentUser?.uid,
    };

    localStorage.setItem('session_data', JSON.stringify(sessionData));
    this.startSessionTimeout();

    return sessionId;
  }

  /**
   * Update session activity
   */
  updateSessionActivity() {
    try {
      const sessionData = JSON.parse(localStorage.getItem('session_data') || '{}');
      sessionData.lastActivity = Date.now();
      localStorage.setItem('session_data', JSON.stringify(sessionData));
    } catch (error) {
      console.error('Failed to update session activity:', error);
    }
  }

  /**
   * Check session validity
   */
  isSessionValid() {
    try {
      const sessionData = JSON.parse(localStorage.getItem('session_data') || '{}');
      if (!sessionData.lastActivity) return false;

      const timeSinceActivity = Date.now() - sessionData.lastActivity;
      return timeSinceActivity < this.sessionTimeout;
    } catch (error) {
      return false;
    }
  }

  /**
   * Start session timeout monitoring
   */
  startSessionTimeout() {
    setInterval(() => {
      if (!this.isSessionValid()) {
        this.handleSessionTimeout();
      }
    }, 60000); // Check every minute
  }

  /**
   * Handle session timeout
   */
  handleSessionTimeout() {
    this.logAuditEvent({
      action: 'session_timeout',
      resource: 'authentication',
      resourceId: auth.currentUser?.uid,
      details: { reason: 'inactivity' },
    });

    localStorage.removeItem('session_data');
    auth.signOut();
    window.location.href = '/login';
  }

  /**
   * Get session ID
   */
  getSessionId() {
    try {
      const sessionData = JSON.parse(localStorage.getItem('session_data') || '{}');
      return sessionData.id || 'unknown';
    } catch (error) {
      return 'unknown';
    }
  }

  /**
   * Get client IP (simplified - in production use proper backend)
   */
  getClientIP() {
    // This is a placeholder - in production, get IP from backend
    return 'client-ip';
  }

  /**
   * Sanitize user input
   */
  sanitizeInput(input) {
    if (typeof input !== 'string') return input;

    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }

  /**
   * Validate email format
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password strength
   */
  validatePasswordStrength(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const score = [
      password.length >= minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
    ].filter(Boolean).length;

    return {
      isValid: score >= 4,
      score,
      requirements: {
        minLength: password.length >= minLength,
        hasUpperCase,
        hasLowerCase,
        hasNumbers,
        hasSpecialChar,
      },
    };
  }

  /**
   * GDPR Compliance - Data export
   */
  exportUserData(userId) {
    this.logAuditEvent({
      action: 'data_export',
      resource: 'user_data',
      resourceId: userId,
      details: { type: 'gdpr_request' },
    });

    // In production, this would gather all user data from various sources
    return {
      userId,
      exportDate: new Date().toISOString(),
      data: {
        profile: 'User profile data would be here',
        students: 'Student data would be here',
        attendance: 'Attendance records would be here',
        billing: 'Billing data would be here',
      },
    };
  }

  /**
   * GDPR Compliance - Data deletion
   */
  deleteUserData(userId) {
    this.logAuditEvent({
      action: 'data_deletion',
      resource: 'user_data',
      resourceId: userId,
      details: { type: 'gdpr_request' },
    });

    // In production, this would delete all user data
    console.log(`GDPR Data deletion requested for user: ${userId}`);
    return true;
  }

  /**
   * Generate security report
   */
  generateSecurityReport() {
    const logs = this.getAuditLogs();
    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const recentLogs = logs.filter(log => new Date(log.timestamp) >= last30Days);

    const report = {
      generatedAt: now.toISOString(),
      period: '30 days',
      totalEvents: recentLogs.length,
      eventsByAction: {},
      failedLogins: recentLogs.filter(log => log.action === 'login_failed').length,
      dataAccess: recentLogs.filter(log => log.action.includes('read')).length,
      dataModification: recentLogs.filter(log => log.action.includes('write')).length,
      uniqueUsers: new Set(recentLogs.map(log => log.userId)).size,
    };

    // Count events by action
    recentLogs.forEach(log => {
      report.eventsByAction[log.action] = (report.eventsByAction[log.action] || 0) + 1;
    });

    return report;
  }

  /**
   * Initialize security monitoring
   */
  initialize() {
    // Set up activity monitoring
    document.addEventListener('click', () => this.updateSessionActivity());
    document.addEventListener('keypress', () => this.updateSessionActivity());

    // Initialize session if user is logged in
    if (auth.currentUser) {
      this.initializeSession();
    }

    console.log('🔒 Security service initialized');
  }
}

// Create singleton instance
const securityService = new SecurityService();

export default securityService;
