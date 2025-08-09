# 🏗️ MULTI-TENANT SAAS ARCHITECTURE PLAN

## **ARCHITECTURE OVERVIEW**

### **🎯 Multi-Tenancy Strategy**

**Approach**: Database-per-tenant with shared application infrastructure
**Isolation Level**: Complete data separation between tutoring businesses
**Scalability**: Horizontal scaling with tenant-specific optimizations

### **🏢 Tenant Hierarchy**

```
Organization (Tutoring Business)
├── Tenant Settings & Configuration
├── Users (Tutors, Admins, Staff)
├── Students
├── Attendance Records
├── Billing & Invoices
├── Reports & Analytics
└── File Storage
```

---

## **DATABASE ARCHITECTURE**

### **🗄️ Firestore Multi-Tenant Schema**

#### **Tenant Collection Structure**

```javascript
/tenants/{tenantId}
  ├── settings/
  │   ├── business_info
  │   ├── branding
  │   ├── features
  │   └── subscription
  ├── users/{userId}
  ├── students/{studentId}
  ├── attendance/{attendanceId}
  ├── billing/{billingId}
  ├── reports/{reportId}
  └── analytics/{analyticsId}
```

#### **Tenant Registration Document**

```javascript
// /tenants/{tenantId}
{
  id: "tenant_uuid",
  businessName: "ABC Tutoring Center",
  domain: "abc-tutoring", // Subdomain or custom domain
  ownerId: "user_uuid",
  subscription: {
    plan: "professional",
    status: "active",
    trialEndsAt: "2025-02-01",
    billingCycle: "monthly"
  },
  settings: {
    timezone: "America/New_York",
    currency: "USD",
    features: ["analytics", "parent_portal", "whatsapp"],
    limits: {
      maxStudents: 200,
      maxUsers: 5,
      storageGB: 10
    }
  },
  branding: {
    logo: "gs://bucket/tenants/tenant_uuid/logo.png",
    primaryColor: "#1976d2",
    secondaryColor: "#dc004e",
    customDomain: "tutoring.abclearning.com"
  },
  createdAt: "2025-01-03T10:00:00Z",
  updatedAt: "2025-01-03T10:00:00Z"
}
```

### **🔐 Security Rules for Multi-Tenancy**

```javascript
// Enhanced security rules with tenant isolation
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper function to get user's tenant ID
    function getUserTenantId() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.tenantId;
    }

    // Helper function to check tenant membership
    function isTenantMember(tenantId) {
      return request.auth != null &&
             exists(/databases/$(database)/documents/tenants/$(tenantId)/users/$(request.auth.uid));
    }

    // Helper function to check tenant admin
    function isTenantAdmin(tenantId) {
      return request.auth != null &&
             get(/databases/$(database)/documents/tenants/$(tenantId)/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Tenant-specific data access
    match /tenants/{tenantId}/{document=**} {
      allow read, write: if isTenantMember(tenantId);
      allow delete: if isTenantAdmin(tenantId);
    }

    // Global user profiles (cross-tenant)
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    // Subscription and billing (system-managed)
    match /subscriptions/{subscriptionId} {
      allow read: if request.auth != null &&
                     resource.data.tenantId == getUserTenantId();
      allow write: if false; // Only system can modify
    }
  }
}
```

---

## **APPLICATION ARCHITECTURE**

### **🔧 Tenant Context Management**

#### **Tenant Context Provider**

```javascript
// src/context/TenantContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { getTenantByUserId, getTenantSettings } from '../services/tenantService';

const TenantContext = createContext();

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within TenantProvider');
  }
  return context;
};

export const TenantProvider = ({ children }) => {
  const { user } = useAuth();
  const [tenant, setTenant] = useState(null);
  const [tenantSettings, setTenantSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadTenantData();
    }
  }, [user]);

  const loadTenantData = async () => {
    try {
      const tenantData = await getTenantByUserId(user.uid);
      const settings = await getTenantSettings(tenantData.id);

      setTenant(tenantData);
      setTenantSettings(settings);
    } catch (error) {
      console.error('Error loading tenant data:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    tenant,
    tenantSettings,
    loading,
    refreshTenant: loadTenantData,
  };

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
};
```

#### **Tenant-Aware Firebase Service**

```javascript
// src/services/tenantFirebaseService.js
import {
  collection,
  doc,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useTenant } from '../context/TenantContext';

class TenantFirebaseService {
  constructor(tenantId) {
    this.tenantId = tenantId;
  }

  // Get tenant-specific collection reference
  getCollection(collectionName) {
    return collection(db, `tenants/${this.tenantId}/${collectionName}`);
  }

  // Get tenant-specific document reference
  getDocument(collectionName, docId) {
    return doc(db, `tenants/${this.tenantId}/${collectionName}`, docId);
  }

  // CRUD operations with tenant isolation
  async getStudents() {
    const studentsRef = this.getCollection('students');
    const snapshot = await getDocs(studentsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async addStudent(studentData) {
    const studentsRef = this.getCollection('students');
    return await addDoc(studentsRef, {
      ...studentData,
      tenantId: this.tenantId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async updateStudent(studentId, updates) {
    const studentRef = this.getDocument('students', studentId);
    return await updateDoc(studentRef, {
      ...updates,
      updatedAt: new Date(),
    });
  }

  async deleteStudent(studentId) {
    const studentRef = this.getDocument('students', studentId);
    return await deleteDoc(studentRef);
  }
}

// Hook to get tenant-aware service
export const useTenantFirebase = () => {
  const { tenant } = useTenant();

  if (!tenant) {
    throw new Error('Tenant context not available');
  }

  return new TenantFirebaseService(tenant.id);
};
```

### **🎨 Tenant Branding System**

#### **Dynamic Theme Provider**

```javascript
// src/theme/TenantThemeProvider.jsx
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useTenant } from '../context/TenantContext';

export const TenantThemeProvider = ({ children }) => {
  const { tenantSettings } = useTenant();

  const theme = createTheme({
    palette: {
      primary: {
        main: tenantSettings?.branding?.primaryColor || '#1976d2',
      },
      secondary: {
        main: tenantSettings?.branding?.secondaryColor || '#dc004e',
      },
    },
    typography: {
      fontFamily: tenantSettings?.branding?.fontFamily || 'Roboto, sans-serif',
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: tenantSettings?.branding?.primaryColor || '#1976d2',
          },
        },
      },
    },
  });

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
```

---

## **SUBSCRIPTION MANAGEMENT**

### **💳 Stripe Integration Architecture**

#### **Subscription Service**

```javascript
// src/services/subscriptionService.js
import { loadStripe } from '@stripe/stripe-js';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebaseConfig';

const stripePromise = loadStripe(process.env.VITE_STRIPE_PUBLISHABLE_KEY);

class SubscriptionService {
  constructor() {
    this.createSubscription = httpsCallable(functions, 'createSubscription');
    this.updateSubscription = httpsCallable(functions, 'updateSubscription');
    this.cancelSubscription = httpsCallable(functions, 'cancelSubscription');
    this.getSubscriptionStatus = httpsCallable(functions, 'getSubscriptionStatus');
  }

  async createCheckoutSession(tenantId, priceId) {
    try {
      const result = await this.createSubscription({
        tenantId,
        priceId,
        successUrl: `${window.location.origin}/subscription/success`,
        cancelUrl: `${window.location.origin}/subscription/cancel`,
      });

      const stripe = await stripePromise;
      return await stripe.redirectToCheckout({
        sessionId: result.data.sessionId,
      });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  async upgradePlan(tenantId, newPriceId) {
    try {
      return await this.updateSubscription({
        tenantId,
        newPriceId,
      });
    } catch (error) {
      console.error('Error upgrading plan:', error);
      throw error;
    }
  }

  async cancelPlan(tenantId) {
    try {
      return await this.cancelSubscription({ tenantId });
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }
}

export default new SubscriptionService();
```

#### **Subscription Plans Configuration**

```javascript
// src/config/subscriptionPlans.js
export const SUBSCRIPTION_PLANS = {
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 29,
    interval: 'month',
    features: [
      'Up to 50 students',
      'Basic attendance tracking',
      'Simple billing',
      'PDF reports',
      'Email support',
    ],
    limits: {
      maxStudents: 50,
      maxUsers: 2,
      storageGB: 5,
      monthlyReports: 10,
    },
    stripePriceId: 'price_starter_monthly',
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    price: 79,
    interval: 'month',
    features: [
      'Up to 200 students',
      'Advanced analytics',
      'Automated billing',
      'Parent portal',
      'WhatsApp integration',
      'Priority support',
    ],
    limits: {
      maxStudents: 200,
      maxUsers: 5,
      storageGB: 20,
      monthlyReports: 50,
    },
    stripePriceId: 'price_professional_monthly',
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    interval: 'month',
    features: [
      'Unlimited students',
      'Multi-tutor management',
      'API access',
      'Custom branding',
      'Advanced integrations',
      'Dedicated support',
    ],
    limits: {
      maxStudents: -1, // Unlimited
      maxUsers: -1, // Unlimited
      storageGB: 100,
      monthlyReports: -1, // Unlimited
    },
    stripePriceId: 'price_enterprise_monthly',
  },
};
```

---

## **USER MANAGEMENT SYSTEM**

### **👥 Multi-Level User Roles**

#### **Role-Based Access Control**

```javascript
// src/utils/permissions.js
export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin', // Platform administrator
  TENANT_ADMIN: 'tenant_admin', // Business owner
  TUTOR: 'tutor', // Individual tutor
  ASSISTANT: 'assistant', // Teaching assistant
  VIEWER: 'viewer', // Read-only access
};

export const PERMISSIONS = {
  // Student management
  STUDENTS_CREATE: 'students:create',
  STUDENTS_READ: 'students:read',
  STUDENTS_UPDATE: 'students:update',
  STUDENTS_DELETE: 'students:delete',

  // Billing management
  BILLING_CREATE: 'billing:create',
  BILLING_READ: 'billing:read',
  BILLING_UPDATE: 'billing:update',
  BILLING_DELETE: 'billing:delete',

  // User management
  USERS_INVITE: 'users:invite',
  USERS_MANAGE: 'users:manage',
  USERS_DELETE: 'users:delete',

  // Settings management
  SETTINGS_UPDATE: 'settings:update',
  SUBSCRIPTION_MANAGE: 'subscription:manage',
};

export const ROLE_PERMISSIONS = {
  [USER_ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),
  [USER_ROLES.TENANT_ADMIN]: [
    PERMISSIONS.STUDENTS_CREATE,
    PERMISSIONS.STUDENTS_READ,
    PERMISSIONS.STUDENTS_UPDATE,
    PERMISSIONS.STUDENTS_DELETE,
    PERMISSIONS.BILLING_CREATE,
    PERMISSIONS.BILLING_READ,
    PERMISSIONS.BILLING_UPDATE,
    PERMISSIONS.BILLING_DELETE,
    PERMISSIONS.USERS_INVITE,
    PERMISSIONS.USERS_MANAGE,
    PERMISSIONS.SETTINGS_UPDATE,
    PERMISSIONS.SUBSCRIPTION_MANAGE,
  ],
  [USER_ROLES.TUTOR]: [
    PERMISSIONS.STUDENTS_CREATE,
    PERMISSIONS.STUDENTS_READ,
    PERMISSIONS.STUDENTS_UPDATE,
    PERMISSIONS.BILLING_READ,
  ],
  [USER_ROLES.ASSISTANT]: [PERMISSIONS.STUDENTS_READ, PERMISSIONS.BILLING_READ],
  [USER_ROLES.VIEWER]: [PERMISSIONS.STUDENTS_READ],
};

export const hasPermission = (userRole, permission) => {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false;
};
```

#### **User Invitation System**

```javascript
// src/services/userInvitationService.js
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebaseConfig';

class UserInvitationService {
  constructor() {
    this.sendInvitation = httpsCallable(functions, 'sendUserInvitation');
    this.acceptInvitation = httpsCallable(functions, 'acceptUserInvitation');
    this.revokeInvitation = httpsCallable(functions, 'revokeUserInvitation');
  }

  async inviteUser(tenantId, email, role) {
    try {
      return await this.sendInvitation({
        tenantId,
        email,
        role,
        invitedBy: auth.currentUser.uid,
      });
    } catch (error) {
      console.error('Error sending invitation:', error);
      throw error;
    }
  }

  async acceptInvite(invitationToken) {
    try {
      return await this.acceptInvitation({
        token: invitationToken,
      });
    } catch (error) {
      console.error('Error accepting invitation:', error);
      throw error;
    }
  }
}

export default new UserInvitationService();
```

---

## **DEPLOYMENT ARCHITECTURE**

### **🚀 Multi-Environment Setup**

#### **Environment Configuration**

```
Development:  localhost:3000
Staging:      staging.mytutorflow.com
Production:   app.mytutorflow.com

Tenant Subdomains:
{tenant}.mytutorflow.com
OR
Custom domains: tutoring.clientdomain.com
```

#### **Firebase Projects Structure**

```
mytutorflow-dev      (Development)
mytutorflow-staging  (Staging)
mytutorflow-prod     (Production)
```

### **📊 Monitoring and Analytics**

#### **Tenant-Specific Analytics**

```javascript
// src/services/analyticsService.js
class TenantAnalyticsService {
  constructor(tenantId) {
    this.tenantId = tenantId;
  }

  trackEvent(eventName, properties = {}) {
    // Track events with tenant context
    analytics.track(eventName, {
      ...properties,
      tenantId: this.tenantId,
      timestamp: new Date().toISOString(),
    });
  }

  trackUserAction(action, userId, metadata = {}) {
    this.trackEvent('user_action', {
      action,
      userId,
      ...metadata,
    });
  }

  trackBusinessMetric(metric, value, unit = 'count') {
    this.trackEvent('business_metric', {
      metric,
      value,
      unit,
    });
  }
}
```

---

## **MIGRATION STRATEGY**

### **🔄 Single-Tenant to Multi-Tenant Migration**

#### **Phase 1: Preparation**

1. **Backup existing data**
2. **Create tenant structure**
3. **Migrate TD Learning Academy as first tenant**
4. **Test multi-tenant functionality**

#### **Phase 2: Implementation**

1. **Deploy multi-tenant code**
2. **Migrate existing users**
3. **Update security rules**
4. **Enable subscription system**

#### **Phase 3: Validation**

1. **Test tenant isolation**
2. **Verify data integrity**
3. **Confirm billing functionality**
4. **Launch beta program**

This architecture provides a solid foundation for scaling from a single tutoring business to a multi-tenant SaaS platform serving hundreds of tutoring businesses.
