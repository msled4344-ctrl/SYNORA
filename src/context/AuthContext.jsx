import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile as updateFirebaseProfile,
  onAuthStateChanged,
  signInWithPopup,
} from 'firebase/auth';
import { auth, googleProvider, isLiveFirebaseConfigured } from '../services/firebase';

const AuthContext = createContext();

// Whitelist of exactly 3 authorized Medical Admin Gmail accounts
export const ADMIN_EMAILS = [
  'msled4344@gmail.com',
  'sumonkin523@gmail.com',
  'sumonraja4344@gmail.com',
];

/**
 * Checks if the given email belongs to the authorized admin whitelist.
 * @param {string} email
 * @returns {boolean}
 */
export const isUserAdmin = (email) => {
  if (!email || typeof email !== 'string') return false;
  return ADMIN_EMAILS.includes(email.trim().toLowerCase());
};

/**
 * Resolves the role strictly based on authenticated email.
 * @param {string} email
 * @returns {'admin' | 'user'}
 */
export const resolveUserRole = (email) => {
  return isUserAdmin(email) ? 'admin' : 'user';
};

const DEFAULT_GUEST_USER = {
  uid: 'synora-user-01',
  email: 'patient@synora.health',
  displayName: 'SYNORA Patient',
  role: 'user',
  photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('synora_current_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email) {
          return {
            ...parsed,
            role: resolveUserRole(parsed.email),
          };
        }
      } catch (e) {
        return null;
      }
    }
    return DEFAULT_GUEST_USER;
  });

  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    if (currentUser) {
      // Always store with re-validated role
      const sanitizedUser = {
        ...currentUser,
        role: resolveUserRole(currentUser.email),
      };
      localStorage.setItem('synora_current_user', JSON.stringify(sanitizedUser));
    } else {
      localStorage.removeItem('synora_current_user');
    }
  }, [currentUser]);

  // Listen to Firebase auth if configured
  useEffect(() => {
    if (isLiveFirebaseConfigured) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          const role = resolveUserRole(user.email);
          const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email?.split('@')[0],
            photoURL: user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            role,
          };
          setCurrentUser(userData);
        }
      });
      return unsubscribe;
    }
  }, []);

  // Sign in with Email & Password
  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    const cleanEmail = email.trim().toLowerCase();
    const role = resolveUserRole(cleanEmail);

    try {
      if (isLiveFirebaseConfigured) {
        const res = await signInWithEmailAndPassword(auth, cleanEmail, password);
        const userRole = resolveUserRole(res.user.email);
        const userData = {
          uid: res.user.uid,
          email: res.user.email,
          displayName: res.user.displayName || cleanEmail.split('@')[0],
          photoURL: res.user.photoURL || (userRole === 'admin'
            ? 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
          role: userRole,
        };
        setCurrentUser(userData);
        return userData;
      } else {
        // Safe local state simulation
        const user = {
          uid: `user-${Date.now()}`,
          email: cleanEmail,
          displayName: cleanEmail.split('@')[0].replace('.', ' '),
          role,
          photoURL: role === 'admin'
            ? 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        };
        setCurrentUser(user);
        return user;
      }
    } catch (err) {
      setAuthError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign up with Email & Password
  const signup = async (email, password, displayName = '') => {
    setLoading(true);
    setAuthError(null);
    const cleanEmail = email.trim().toLowerCase();
    const role = resolveUserRole(cleanEmail);

    try {
      if (isLiveFirebaseConfigured) {
        const res = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        if (displayName) {
          await updateFirebaseProfile(res.user, { displayName });
        }
        const userRole = resolveUserRole(res.user.email);
        const userData = {
          uid: res.user.uid,
          email: res.user.email,
          displayName: displayName || cleanEmail.split('@')[0],
          photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          role: userRole,
        };
        setCurrentUser(userData);
        return userData;
      } else {
        const user = {
          uid: `user-${Date.now()}`,
          email: cleanEmail,
          displayName: displayName || cleanEmail.split('@')[0],
          role,
          photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        };
        setCurrentUser(user);
        return user;
      }
    } catch (err) {
      setAuthError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Google Login
  const loginWithGoogle = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      if (isLiveFirebaseConfigured) {
        const res = await signInWithPopup(auth, googleProvider);
        const role = resolveUserRole(res.user.email);
        const userData = {
          uid: res.user.uid,
          email: res.user.email,
          displayName: res.user.displayName,
          photoURL: res.user.photoURL,
          role,
        };
        setCurrentUser(userData);
        return userData;
      } else {
        const user = {
          uid: 'google-user-01',
          email: 'patient.care@gmail.com',
          displayName: 'Google Health User',
          role: 'user',
          photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        };
        setCurrentUser(user);
        return user;
      }
    } catch (err) {
      setAuthError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      if (isLiveFirebaseConfigured) {
        await signOut(auth);
      }
      localStorage.removeItem('synora_current_user');
      setCurrentUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Reset Password
  const resetPassword = async (email) => {
    if (isLiveFirebaseConfigured) {
      return sendPasswordResetEmail(auth, email);
    }
    return Promise.resolve(true);
  };

  // Update profile details (role is strictly immutable from client update)
  const updateProfileData = async (data) => {
    if (currentUser) {
      const { role, ...allowedData } = data;
      const updated = {
        ...currentUser,
        ...allowedData,
        role: resolveUserRole(currentUser.email),
      };
      setCurrentUser(updated);
      return updated;
    }
  };

  // Is Admin is strictly derived from email match
  const isAdmin = currentUser?.email ? isUserAdmin(currentUser.email) : false;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        authError,
        login,
        signup,
        loginWithGoogle,
        logout,
        resetPassword,
        updateProfileData,
        isAdmin,
        ADMIN_EMAILS,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
