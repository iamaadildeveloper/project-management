// context/AuthContext.js
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword
} from 'firebase/auth';
// IMPORTANT: We import auth and googleProvider from your existing firebase setup
import { auth, googleProvider } from '../lib/firebase'; // Adjust path if needed

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  // Renamed 'user' to 'currentUser' for clarity and consistency with LoginPage
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [migrationStatus, setMigrationStatus] = useState({
    success: null,
    count: 0
  });

  useEffect(() => {
    // This listener observes authentication state changes from Firebase
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // --- ADDED FOR DEBUGGING ---
      console.log('onAuthStateChanged: User object received:', user);
      // --- END DEBUGGING ---

      // Update the currentUser state whenever the auth state changes
      setCurrentUser(user);
      setLoading(false);

      // Only attempt migration if a user is logged in
      if (user) {
        try {
          // Dynamically import migrateData to avoid server-side issues if it uses localStorage
          const { migrateLocalData } = await import('../lib/migrateData');
          const result = await migrateLocalData();
          setMigrationStatus(result);
        } catch (error) {
          console.error('Migration failed:', error);
          setMigrationStatus({ success: false, count: 0 });
        }
      } else {
        // If no user, reset migration status
        setMigrationStatus({ success: null, count: 0 });
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []); // Empty dependency array means this runs once on mount

  // Firebase login methods
  const loginWithEmail = async (email, password) => {
    // Ensure auth is initialized before use
    if (!auth) throw new Error("Firebase Auth is not initialized. Check lib/firebase.js");
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signupWithEmail = async (email, password) => {
    if (!auth) throw new Error("Firebase Auth is not initialized. Check lib/firebase.js");
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const googleLogin = async () => {
    if (!auth || !googleProvider) throw new Error("Firebase Auth or Google Provider not initialized. Check lib/firebase.js");
    await signInWithPopup(auth, googleProvider);
    // The onAuthStateChanged listener will automatically update currentUser and trigger redirect
  };

  const logout = async () => {
    if (!auth) throw new Error("Firebase Auth is not initialized. Check lib/firebase.js");
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser, // Expose the user state
        loginWithEmail,
        signupWithEmail,
        googleLogin,
        logout,
        loading,
        migrationStatus
      }}
    >
      {/* Only render children when authentication state is known */}
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
