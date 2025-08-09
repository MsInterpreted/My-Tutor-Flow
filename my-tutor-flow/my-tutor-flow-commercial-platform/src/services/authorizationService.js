import { db } from '../firebaseConfig';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  getDocs,
  addDoc,
} from 'firebase/firestore';

// Predefined authorization codes for tutors
const AUTHORIZATION_CODES = {
  // Master admin codes (for business owners/managers)
  'MASTER-TUTOR-2024': {
    role: 'admin',
    permissions: ['all'],
    description: 'Master Admin Access - Primary Owner',
    createdBy: 'system',
  },
  'ADMIN-PARTNER-001': {
    role: 'admin',
    permissions: ['all'],
    description: 'Admin Access - Business Partner',
    createdBy: 'system',
  },
  'ADMIN-MANAGER-001': {
    role: 'admin',
    permissions: ['all'],
    description: 'Admin Access - Operations Manager',
    createdBy: 'system',
  },
  // Assistant tutor codes
  'TUTOR-ASSIST-001': {
    role: 'tutor',
    permissions: ['students', 'attendance', 'reports', 'dashboard'],
    description: 'Assistant Tutor Access',
    createdBy: 'admin',
  },
  'TUTOR-ASSIST-002': {
    role: 'tutor',
    permissions: ['students', 'attendance', 'reports', 'dashboard'],
    description: 'Assistant Tutor Access',
    createdBy: 'admin',
  },
  'TUTOR-ASSIST-003': {
    role: 'tutor',
    permissions: ['students', 'attendance', 'reports', 'dashboard'],
    description: 'Assistant Tutor Access',
    createdBy: 'admin',
  },
  // Limited access codes
  'TUTOR-VIEW-001': {
    role: 'viewer',
    permissions: ['students', 'reports'],
    description: 'View Only Access',
    createdBy: 'admin',
  },
};

// User roles and their permissions
export const USER_ROLES = {
  admin: {
    name: 'Administrator',
    permissions: ['all'],
    canManageUsers: true,
    canAccessBusiness: true,
  },
  tutor: {
    name: 'Tutor',
    permissions: ['students', 'attendance', 'reports', 'dashboard'],
    canManageUsers: false,
    canAccessBusiness: false,
  },
  viewer: {
    name: 'Viewer',
    permissions: ['students', 'reports'],
    canManageUsers: false,
    canAccessBusiness: false,
  },
};

// Validate authorization code
export const validateAuthorizationCode = async code => {
  try {
    // Check predefined codes
    if (AUTHORIZATION_CODES[code]) {
      return {
        isValid: true,
        role: AUTHORIZATION_CODES[code].role,
        permissions: AUTHORIZATION_CODES[code].permissions,
        description: AUTHORIZATION_CODES[code].description,
      };
    }

    // Check custom codes in database
    const codesRef = collection(db, 'authorizationCodes');
    const q = query(codesRef, where('code', '==', code), where('isActive', '==', true));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const codeDoc = querySnapshot.docs[0];
      const codeData = codeDoc.data();

      // Check if code has expired
      if (codeData.expiresAt && codeData.expiresAt.toDate() < new Date()) {
        return {
          isValid: false,
          error: 'Authorization code has expired',
        };
      }

      return {
        isValid: true,
        role: codeData.role,
        permissions: codeData.permissions,
        description: codeData.description,
      };
    }

    return {
      isValid: false,
      error: 'Invalid authorization code',
    };
  } catch (error) {
    console.error('Error validating authorization code:', error);
    return {
      isValid: false,
      error: 'Error validating authorization code',
    };
  }
};

// Create user profile with role and permissions
export const createUserProfile = async (userId, email, authCode, userData = {}) => {
  try {
    const authResult = await validateAuthorizationCode(authCode);

    if (!authResult.isValid) {
      throw new Error(authResult.error);
    }

    const userProfile = {
      email,
      role: authResult.role,
      permissions: authResult.permissions,
      authorizationCode: authCode,
      createdAt: new Date(),
      lastLogin: new Date(),
      isActive: true,
      ...userData,
    };

    await setDoc(doc(db, 'userProfiles', userId), userProfile);

    // Log the authorization usage
    await addDoc(collection(db, 'authorizationLogs'), {
      userId,
      email,
      authorizationCode: authCode,
      action: 'account_created',
      timestamp: new Date(),
      role: authResult.role,
    });

    return userProfile;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

// Get user profile and permissions
export const getUserProfile = async userId => {
  try {
    const userDoc = await getDoc(doc(db, 'userProfiles', userId));

    if (!userDoc.exists()) {
      return null;
    }

    const userData = userDoc.data();
    const roleInfo = USER_ROLES[userData.role] || USER_ROLES.viewer;

    return {
      ...userData,
      roleInfo,
    };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

// Check if user has specific permission
export const hasPermission = (userProfile, permission) => {
  if (!userProfile || !userProfile.permissions) {
    return false;
  }

  // Admin has all permissions
  if (userProfile.permissions.includes('all')) {
    return true;
  }

  return userProfile.permissions.includes(permission);
};

// Update user last login
export const updateLastLogin = async userId => {
  try {
    await updateDoc(doc(db, 'userProfiles', userId), {
      lastLogin: new Date(),
    });
  } catch (error) {
    console.error('Error updating last login:', error);
  }
};

// Generate new authorization code (admin only)
export const generateAuthorizationCode = async (adminUserId, codeData) => {
  try {
    const adminProfile = await getUserProfile(adminUserId);

    if (!adminProfile || !adminProfile.roleInfo.canManageUsers) {
      throw new Error('Insufficient permissions to generate authorization codes');
    }

    const newCode = `TUTOR-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    const authCodeDoc = {
      code: newCode,
      role: codeData.role || 'tutor',
      permissions: codeData.permissions || ['students', 'attendance', 'reports'],
      description: codeData.description || 'Generated Tutor Access',
      createdBy: adminUserId,
      createdAt: new Date(),
      expiresAt: codeData.expiresAt || null,
      isActive: true,
      usageCount: 0,
      maxUsage: codeData.maxUsage || null,
    };

    await addDoc(collection(db, 'authorizationCodes'), authCodeDoc);

    return newCode;
  } catch (error) {
    console.error('Error generating authorization code:', error);
    throw error;
  }
};

// Get all authorization codes (admin only)
export const getAuthorizationCodes = async adminUserId => {
  try {
    const adminProfile = await getUserProfile(adminUserId);

    if (!adminProfile || !adminProfile.roleInfo.canManageUsers) {
      throw new Error('Insufficient permissions to view authorization codes');
    }

    const codesRef = collection(db, 'authorizationCodes');
    const querySnapshot = await getDocs(codesRef);

    const codes = [];
    querySnapshot.forEach(doc => {
      codes.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    // Add predefined codes
    Object.entries(AUTHORIZATION_CODES).forEach(([code, data]) => {
      codes.push({
        id: `predefined-${code}`,
        code,
        ...data,
        isPredefined: true,
        isActive: true,
      });
    });

    return codes;
  } catch (error) {
    console.error('Error getting authorization codes:', error);
    throw error;
  }
};

export default {
  validateAuthorizationCode,
  createUserProfile,
  getUserProfile,
  hasPermission,
  updateLastLogin,
  generateAuthorizationCode,
  getAuthorizationCodes,
  USER_ROLES,
};
