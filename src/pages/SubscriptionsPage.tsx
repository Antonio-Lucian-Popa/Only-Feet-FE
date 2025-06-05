import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSubscriptions } from '@/context/SubscriptionContext';
import { useNavigate } from 'react-router-dom';
import { getCreator } from '@/lib/api';
import { Creator } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import CreatorCard, { CreatorCardSkeleton } from '@/components/creators/CreatorCard';
import { CalendarIcon, CreditCardIcon } from 'lucide-react';

const SubscriptionsPage: React.FC = () => {
  const [subscribedCreators, setSubscribedCreators] = useState<Creator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { subscriptions } = useSubscriptions();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (user && user.role !== 'USER') {
      toast({
        variant: 'default',
        title: 'Creator account',
        description: 'Creators cannot subscribe to other creators.',
      });
    }
  }, [user, toast]);

  useEffect(() => {
    const fetchSubscribedCreators = async () => {
      if (!subscriptions.length) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const creators = await Promise.all(
          subscriptions
            .filter(sub => sub.status === 'active')
            .map(async sub => {
              const response = await getCreator(sub.creatorId);
              return {
                ...response.data,
                subscriptionEnds: sub.currentPeriodEnd,
              };
            })
        );
        setSubscribedCreators(creators);
      } catch (error) {
        console.error('Error fetching subscribed creators:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load your subscriptions.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscribedCreators();
  }, [subscriptions, toast]);

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(dateString));
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-4 mb-8">
        <h1 className="text-3xl font-bold">My Subscriptions</h1>
        <p className="text-muted-foreground">
          Manage your active subscriptions to creators
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <CreatorCardSkeleton key={index} />
          ))}
        </div>
      ) : subscribedCreators.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {subscribedCreators.map((creator: any) => (
              <div key={creator.id} className="space-y-2">
                <CreatorCard creator={creator} isSubscribed={true} />
                <div className="px-4 py-2 bg-secondary/50 rounded-lg text-sm flex items-center justify-between">
                  <div className="flex items-center">
                    <CalendarIcon className="h-3 w-3 mr-1 text-muted-foreground" />
                    <span>Renews: {formatDate(creator.subscriptionEnds)}</span>
                  </div>
                  <div className="flex items-center">
                    <CreditCardIcon className="h-3 w-3 mr-1 text-muted-foreground" />
                    <span>${creator.subscriptionPrice}/mo</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-card">
          <CreditCardIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No active subscriptions</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            You're not currently subscribed to any creators. Discover new creators and subscribe to access their exclusive content.
          </p>
          <button 
            onClick={() => navigate('/discover')}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
          >
            Discover Creators
          </button>
        </div>
      )}
    </div>
  );
};

export default SubscriptionsPage;