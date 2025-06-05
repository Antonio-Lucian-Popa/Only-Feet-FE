import api from './api';
import { Creator } from '@/lib/types';

export const getCreators = async () => {
  const response = await api.get<{ data: Creator[] }>('/creators');
  return response.data;
};

export const getCreator = async (id: string) => {
  const response = await api.get<{ data: Creator }>(`/creators/${id}`);
  return response.data;
};