// src/api/auth.ts

// Mock de login: devuelve un usuario de prueba
export const login = async (email: string, password: string) => {
  return {
    id: 1,
    nombre: 'Usuario Demo',
    rol: 'admin',
    permisos: ['ver_alumnos', 'ver_pagos', 'ver_evaluaciones', 'ver_asistencia']
  };
};

// Mock de logout: simplemente limpia datos
export const logout = () => {
  console.log('Sesión cerrada');
};

// Mock de usuario actual
export const getCurrentUser = async () => {
  return {
    id: 1,
    nombre: 'Usuario Demo',
    rol: 'admin',
    permisos: ['ver_alumnos', 'ver_pagos', 'ver_evaluaciones', 'ver_asistencia']
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