import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getUserSubscriptions, Subscription } from '@/lib/api';

interface SubscriptionContextType {
  subscriptions: Subscription[];
  isLoading: boolean;
  refreshSubscriptions: () => Promise<void>;
  isSubscribedTo: (creatorId: string) => boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  subscriptions: [],
  isLoading: true,
  refreshSubscriptions: async () => {},
  isSubscribedTo: () => false,
});

export const useSubscriptions = () => useContext(SubscriptionContext);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  const loadSubscriptions = async () => {
    if (!isAuthenticated) {
      setSubscriptions([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await getUserSubscriptions();
      if (response.data) {
        setSubscriptions(response.data);
      }
    } catch (error) {
      console.error('Error loading subscriptions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load subscriptions when user authentication state changes
  useEffect(() => {
    loadSubscriptions();
  }, [isAuthenticated]);

  const isSubscribedTo = (creatorId: string): boolean => {
    return subscriptions.some(
      (sub) =>
        sub.creatorId === creatorId &&
        sub.status === 'active' &&
        new Date(sub.currentPeriodEnd) > new Date()
    );
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscriptions,
        isLoading,
        refreshSubscriptions: loadSubscriptions,
        isSubscribedTo,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};