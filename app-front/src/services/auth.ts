// src/api/auth.ts

// Mock login: returns a demo user
export const login = async (email: string, password: string) => {
  return {
    id: 1,
    name: 'Usuario Demo', // 👈 texto visible en español
    role: 'admin',
    permissions: ['view_students', 'view_payments', 'view_evaluations', 'view_attendance', 'view_settings']
  };
};

// Mock logout: simply clears data
export const logout = () => {
  console.log('Sesión cerrada'); // 👈 texto visible en español
};

// Mock current user
export const getCurrentUser = async () => {
  return {
    id: 1,
    name: 'Usuario Demo', // 👈 texto visible en español
    role: 'admin',
    permissions: ['view_students', 'view_payments', 'view_evaluations', 'view_attendance', 'view_settings']
  };
};










/* // src/api/auth.ts
import axios from 'axios';

const API_URL = '/api/auth'; // ajusta según tu backend

export const login = async (email: string, password: string) => {
  const { data } = await axios.post(`${API_URL}/login/`, { email, password });
  localStorage.setItem('token', data.token);
  return data.user;
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const { data } = await axios.get(`${API_URL}/me/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    return null;
  }
};
 */