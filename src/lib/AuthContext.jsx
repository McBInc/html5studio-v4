"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { data: session, status } = useSession();
  
  const user = session?.user || null;
  const isAuthenticated = status === "authenticated";
  const isLoadingAuth = status === "loading";
  
  // Stubbed public settings for backwards compatibility with v5 components
  const [appPublicSettings, setAppPublicSettings] = useState({});
  const isLoadingPublicSettings = false;
  const authError = null;

  const logout = (shouldRedirect = true) => {
    signOut({ redirect: shouldRedirect, callbackUrl: '/' });
  };

  const navigateToLogin = () => {
    signIn();
  };
  
  const checkAppState = async () => {
    // Stubbed - NextAuth handles session lifecycle automatically
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      logout,
      navigateToLogin,
      checkAppState
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
