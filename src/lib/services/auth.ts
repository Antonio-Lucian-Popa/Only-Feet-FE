import api from './api';
import { User } from '@/lib/types';

export const login = async (email: string, password: string) => {
  const response = await api.post<{ token: string; user: User }>('/auth/login', { 
    email, 
    password 
  });
  return response.data;
};

export const register = async (username: string, email: string, password: string, role: 'CREATOR' | 'USER') => {
  const response = await api.post<{ token: string; user: User }>('/auth/register', { 
    username, 
    email, 
    password, 
    role 
  });
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get<{ data: User }>('/user/me');
  return response.data;
};