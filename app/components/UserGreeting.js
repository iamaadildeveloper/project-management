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
import { auth, googleProvider } from '../lib/firebase'; // Adjust path if needed

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  // RENAMED: 'user' to 'currentUser' for consistency with components consuming it
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [migrationStatus, setMigrationStatus] = useState({
    success: null,
    count: 0
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // Set the currentUser state to the user object received from Firebase
      setCurrentUser(user);
      setLoading(false);

      if (user) {
        try {
          const { migrateLocalData } = await import('../lib/migrateData');
          const result = await migrateLocalData();
          setMigrationStatus(result);
        } catch (error) {
          console.error('Migration failed:', error);
          setMigrationStatus({ success: false, count: 0 });
        }
      } else {
        setMigrationStatus({ success: null, count: 0 });
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email, password) => {
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
  };

  const logout = async () => {
    if (!auth) throw new Error("Firebase Auth is not initialized. Check lib/firebase.js");
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser, // EXPOSE the correctly named 'currentUser' state
        loginWithEmail,
        signupWithEmail,
        googleLogin,
        logout,
        loading,
        migrationStatus
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
