import axios from 'axios';
import { Creator, Media, Subscription, User, ApiResponse } from './types';
import { API_URL } from '@/utils/constants';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const login = async (email: string, password: string) => {
  const response = await api.post<{ token: string; user: User }>('/auth/login', { 
    email, 
    password 
  });
  return response.data;
};

export const register = async (firstName: string, lastName:string, email: string, password: string, role: 'CREATOR' | 'USER') => {
  const response = await api.post<{ token: string; user: User }>('/auth/register', { 
    firstName,
    lastName, 
    email, 
    password, 
    role 
  });
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get<ApiResponse<User>>('/user/me');
  return response.data;
};

// Creators
export const getCreators = async () => {
  const response = await api.get<ApiResponse<Creator[]>>('/creators');
  return response.data;
};

export const getCreator = async (id: string) => {
  const response = await api.get<ApiResponse<Creator>>(`/creators/${id}`);
  return response.data;
};

// Media
export const getCreatorMedia = async (creatorId: string) => {
  const response = await api.get<ApiResponse<Media[]>>(`/media/creator/${creatorId}`);
  return response.data;
};

export const uploadMedia = async (formData: FormData) => {
  const response = await api.post<ApiResponse<Media>>('/media/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Subscriptions
export const getUserSubscriptions = async () => {
  const response = await api.get<ApiResponse<Subscription[]>>('/subscriptions/user');
  return response.data;
};

export const createCheckoutSession = async (creatorId: string) => {
  const response = await api.post<{ url: string }>('/subscriptions/create-checkout-session', { 
    creatorId 
  });
  return response.data;
};

export const isUserSubscribedToCreator = async (creatorId: string) => {
  try {
    const { data } = await getUserSubscriptions();
    return data.some(sub => 
      sub.creatorId === creatorId && 
      sub.status === 'active' && 
      new Date(sub.currentPeriodEnd) > new Date()
    );
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return false;
  }
};

export default api;