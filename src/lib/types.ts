export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'CREATOR' | 'USER';
  profilePicture?: string;
  bio?: string;
  username?: string;
  createdAt: string;
}

export interface Creator extends User {
  subscriptionPrice: number;
  subscribersCount: number;
  mediaCount: number;
  coverPhoto?: string;
}

export interface Media {
  id: string;
  creatorId: string;
  title: string;
  description?: string;
  url: string;
  thumbnailUrl?: string;
  isPublic: boolean;
  type: 'image' | 'video';
  duration?: number;
  createdAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  creatorId: string;
  status: 'active' | 'canceled' | 'past_due';
  currentPeriodEnd: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}