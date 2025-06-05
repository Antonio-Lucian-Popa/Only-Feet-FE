import api from './api';
import { Media } from '@/lib/types';

export const getCreatorMedia = async (creatorId: string) => {
  const response = await api.get<{ data: Media[] }>(`/media/creator/${creatorId}`);
  return response.data;
};

export const uploadMedia = async (formData: FormData) => {
  const response = await api.post<{ data: Media }>('/media/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};