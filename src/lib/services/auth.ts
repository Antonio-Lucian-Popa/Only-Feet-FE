import api from './api';
import { User } from '@/lib/types';

export const login = async (email: string, password: string) => {
  const response = await api.post<{ accessToken: string; refreshToken: string }>('/auth/login', { 
    email, 
    password 
  });
  return response.data;
};

export const register = async (firstName: string, lastName: string, email: string, password: string, role: 'CREATOR' | 'USER') => {
  const response = await api.post<User>('/auth/register', { 
    firstName,
    lastName, 
    email, 
    password, 
    role 
  });
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get<User>('/auth/me');
  return response.data;
};