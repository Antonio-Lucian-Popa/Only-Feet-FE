import api from './api';
import { Creator, Post } from '@/lib/types';

export const getCreators = async () => {
  const response = await api.get<Creator[]>('/creators');
  return response.data;
};

export const getCreator = async (id: string) => {
  const response = await api.get<{ data: Creator }>(`/creators/${id}`);
  return response.data;
};

export const createPost = async (formData: FormData) => {
  const response = await api.post<{ data: Post }>(`/posts`, formData, {});
  return response.data;
}