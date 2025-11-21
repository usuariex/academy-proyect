// src/context/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as loginService, logout as logoutService, getCurrentUser } from '../api/auth';

interface User {
  id: number;
  nombre: string;
  rol: string;
  permisos: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permiso: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Al cargar la app, intenta recuperar el usuario actual
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

  const hasPermission = (permiso: string) => {
    return user?.permisos?.includes(permiso) ?? false;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};
