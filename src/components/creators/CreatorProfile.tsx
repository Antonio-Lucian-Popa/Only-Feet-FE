import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCreator, getCreatorMedia, createCheckoutSession } from '@/lib/api';
import { Creator, Media } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { useSubscriptions } from '@/context/SubscriptionContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2Icon, CalendarIcon } from 'lucide-react';
import MediaGallery from '../media/MediaGallery';

const CreatorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { isSubscribedTo } = useSubscriptions();
  const { toast } = useToast();
  const navigate = useNavigate();

  const isSubscribed = creator ? isSubscribedTo(creator.id) : false;

  useEffect(() => {
    const fetchCreatorData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const creatorResponse = await getCreator(id);
        setCreator(creatorResponse.data);

        const mediaResponse = await getCreatorMedia(id);
        setMedia(mediaResponse.data);
      } catch (error) {
        console.error('Error fetching creator data:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load creator profile.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCreatorData();
  }, [id, toast]);

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication required',
        description: 'Please login to subscribe to creators.',
        variant: 'default',
      });
      navigate('/login');
      return;
    }

    if (!creator) return;

    try {
      setSubscribing(true);
      const { url } = await createCheckoutSession(creator.id);
      window.location.href = url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        variant: 'destructive',
        title: 'Subscription error',
        description: 'Failed to create subscription. Please try again.',
      });
    } finally {
      setSubscribing(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
    }).format(date);
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <Skeleton className="h-32 w-32 rounded-full" />
            <div className="space-y-4 text-center md:text-left flex-1">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-64" />
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold">Creator not found</h1>
        <p className="text-muted-foreground mt-2">The creator you're looking for doesn't exist or has been removed.</p>
        <Button className="mt-4" onClick={() => navigate('/discover')}>
          Discover Creators
        </Button>
      </div>
    );
  }

  const publicMedia = media.filter(item => item.isPublic);
  const privateMedia = media.filter(item => !item.isPublic);

  return (
    <div className="container py-8">
      <Card className="mb-8">
        {creator.coverPhoto && (
          <div 
            className="h-48 w-full bg-cover bg-center" 
            style={{ backgroundImage: `url(${creator.coverPhoto})` }}
          />
        )}
        <CardContent className={`py-6 ${creator.coverPhoto ? '-mt-16' : ''}`}>
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <Avatar className="h-32 w-32 border-4 border-background">
              <AvatarImage src={creator.profilePicture} alt={creator.username} />
              <AvatarFallback>{creator.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            
            <div className="space-y-4 text-center md:text-left flex-1">
              <div>
                <h1 className="text-3xl font-bold">{creator.username}</h1>
                <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground mt-1">
                  <CalendarIcon className="h-4 w-4" />
                  <span>Joined {formatDate(creator.createdAt)}</span>
                </div>
              </div>
              
              {creator.bio && <p>{creator.bio}</p>}
              
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <Badge variant="secondary" className="text-sm">
                  {creator.subscribersCount} {creator.subscribersCount === 1 ? 'subscriber' : 'subscribers'}
                </Badge>
                <Badge variant="outline" className="text-sm">
                  {creator.mediaCount} {creator.mediaCount === 1 ? 'photo' : 'photos'}
                </Badge>
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              {isSubscribed ? (
                <>
                  <Badge className="mb-2 py-1 px-3 bg-primary">
                    Subscribed
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Full Access
                  </span>
                </>
              ) : (
                <>
                  <div className="text-center mb-2">
                    <div className="text-2xl font-bold">${creator.subscriptionPrice}</div>
                    <div className="text-xs text-muted-foreground">per month</div>
                  </div>
                  <Button 
                    onClick={handleSubscribe} 
                    disabled={subscribing || user?.id === creator.id}
                    className="w-full"
                  >
                    {subscribing ? (
                      <>
                        <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Subscribe'
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="w-full md:w-auto justify-start">
          <TabsTrigger value="all">All Photos ({media.length})</TabsTrigger>
          <TabsTrigger value="public">Public ({publicMedia.length})</TabsTrigger>
          <TabsTrigger value="private">Premium ({privateMedia.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <MediaGallery 
            media={media} 
            isSubscribed={isSubscribed} 
            emptyMessage="This creator hasn't uploaded any photos yet."
          />
        </TabsContent>
        
        <TabsContent value="public">
          <MediaGallery 
            media={publicMedia} 
            isSubscribed={isSubscribed} 
            emptyMessage="No public photos available."
          />
        </TabsContent>
        
        <TabsContent value="private">
          <MediaGallery 
            media={privateMedia} 
            isSubscribed={isSubscribed}
            emptyMessage="No premium photos available."
          />
          {!isSubscribed && privateMedia.length > 0 && (
            <div className="mt-6 text-center">
              <p className="text-muted-foreground mb-4">
                Subscribe to unlock all premium content from this creator
              </p>
              <Button onClick={handleSubscribe} disabled={subscribing || user?.id === creator.id}>
                {subscribing ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Subscribe - $${creator.subscriptionPrice}/month`
                )}
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreatorProfile;