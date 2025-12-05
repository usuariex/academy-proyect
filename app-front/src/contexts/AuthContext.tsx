import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as loginService, logout as logoutService, getCurrentUser } from '../services/auth';

interface User {
  id: number;
  name: string;
  role: string;
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // On app load, try to recover the current user
    const fetchUser = async () => {
      const current = await getCurrentUser();
      if (current) setUser(current);
    };
    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    const loggedUser = await loginService(email, password);
    setUser(loggedUser);
  };

  const logout = () => {
    logoutService();
    setUser(null);
  };

  const hasPermission = (permission: string) => {
    return user?.permissions?.includes(permission) ?? false;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
