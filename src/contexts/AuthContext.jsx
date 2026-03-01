import React, { createContext, useState, useEffect } from 'react';
import { getUserProfile, updateLastLogin } from '../services/authorizationService';

// Auth Context for global state management
export const AuthContext = createContext(null);

// Auth Provider Component
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('🔐 Initializing Firebase Authentication...');

        // Import Firebase auth functions
        const { onAuthStateChanged } = await import('firebase/auth');
        const { auth } = await import('../firebaseConfig');

        // Set up Firebase auth state listener
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          try {
            setCurrentUser(user);
            if (user) {
              console.log('✅ User authenticated:', user.email);

              // Get user profile with authorization data
              const profile = await getUserProfile(user.uid);
              if (profile) {
                setUserProfile(profile);
                setUserRole(profile.role);
                // Update last login
                await updateLastLogin(user.uid);
              } else {
                // Create default profile for new users
                const defaultProfile = {
                  role: 'tutor',
                  permissions: ['students', 'attendance', 'reports', 'dashboard', 'billing'],
                  name: user.displayName || 'TD Learning Academy User',
                  email: user.email,
                };
                setUserRole(defaultProfile.role);
                setUserProfile(defaultProfile);
              }
            } else {
              console.log('🔐 No user authenticated');
              setUserRole(null);
              setUserProfile(null);
            }
          } catch (error) {
            console.error('Error processing auth state:', error);
            // Set default fallback
            if (user) {
              setUserRole('tutor');
              setUserProfile({
                role: 'tutor',
                permissions: ['students', 'attendance', 'reports', 'dashboard', 'billing'],
                name: user.displayName || 'TD Learning Academy User',
                email: user.email,
              });
            }
          } finally {
            setLoadingAuth(false);
          }
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Firebase auth initialization failed:', error);
        // Fallback to localStorage auth if Firebase fails
        try {
          const persistedAuth = localStorage.getItem('tdla_auth');
          const persistedUser = localStorage.getItem('tdla_user');
          const persistedProfile = localStorage.getItem('tdla_profile');

          if (persistedAuth === 'true' && persistedUser && persistedProfile) {
            const user = JSON.parse(persistedUser);
            const profile = JSON.parse(persistedProfile);

            console.log('⚠️ Using localStorage fallback authentication');
            setCurrentUser(user);
            setUserRole(profile.role);
            setUserProfile(profile);
          }
        } catch (fallbackError) {
          console.error('Fallback auth failed:', fallbackError);
        } finally {
          setLoadingAuth(false);
        }
      }
    };

    initAuth();
  }, []);

  const handleLogout = async () => {
    try {
      console.log('🚪 Logging out...');

      // Try Firebase signOut first
      try {
        const { auth } = await import('../firebaseConfig');
        await auth.signOut();
        console.log('✅ Firebase logout successful');
      } catch (firebaseError) {
        console.warn('⚠️ Firebase logout failed, clearing local state:', firebaseError.message);
      }

      // Clear localStorage as backup
      localStorage.removeItem('tdla_auth');
      localStorage.removeItem('tdla_user');
      localStorage.removeItem('tdla_profile');

      // Clear state
      setCurrentUser(null);
      setUserRole(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleLogin = (user, profile) => {
    try {
      console.log('✅ Logging in - persisting to localStorage');

      // Persist authentication to localStorage
      localStorage.setItem('tdla_auth', 'true');
      localStorage.setItem('tdla_user', JSON.stringify(user));
      localStorage.setItem('tdla_profile', JSON.stringify(profile));

      // Update state
      setCurrentUser(user);
      setUserProfile(profile);
      setUserRole(profile?.role || 'tutor');
    } catch (error) {
      console.error('Error persisting login:', error);
      // Still update state even if localStorage fails
      setCurrentUser(user);
      setUserProfile(profile);
      setUserRole(profile?.role || 'tutor');
    }
  };

  const value = {
    currentUser,
    userRole,
    userProfile,
    loadingAuth,
    handleLogout,
    handleLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
