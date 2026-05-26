import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRoleState] = useState<UserRole>(() => {
    return authService.getCurrentRole();
  });

  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
    authService.setCurrentRole(role);
  };

  const isAdmin = currentRole === 'school_admin' || currentRole === 'super_admin';

  return (
    <AuthContext.Provider value={{ currentRole, setCurrentRole, isAdmin }}>
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
