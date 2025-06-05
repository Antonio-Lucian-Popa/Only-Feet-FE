import api from './api';
import { Subscription } from '@/lib/types';

export const getUserSubscriptions = async () => {
  const response = await api.get<{ data: Subscription[] }>('/subscriptions/user');
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