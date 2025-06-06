import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useSubscriptions } from '@/context/SubscriptionContext';
import { getCreators } from '@/lib/services/creators';
import { getCreatorMedia } from '@/lib/services/media';
import { Creator, Media } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HeartIcon, MessageCircleIcon, ShareIcon, ClockIcon } from 'lucide-react';

interface FeedPost {
  id: string;
  creator: Creator;
  media: Media;
  isSubscribed: boolean;
}

const PersonalizedFeed: React.FC = () => {
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>([]);
  const [popularCreators, setPopularCreators] = useState<Creator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { subscriptions, isSubscribedTo } = useSubscriptions();
  const { toast } = useToast();

  useEffect(() => {
    const fetchFeedData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all creators
        const allCreators = await getCreators();
        
        // Get popular creators (top 6 by subscriber count)
        const popular = allCreators
          .sort((a, b) => b.subscribersCount - a.subscribersCount)
          .slice(0, 6);
        setPopularCreators(popular);

        // Get subscribed creators
        const subscribedCreatorIds = subscriptions
          .filter(sub => sub.status === 'active')
          .map(sub => sub.creatorId);

        const subscribedCreators = allCreators.filter(creator => 
          subscribedCreatorIds.includes(creator.id)
        );

        // Fetch recent media from subscribed creators
        const feedData: FeedPost[] = [];
        
        for (const creator of subscribedCreators) {
          try {
            const mediaResponse = await getCreatorMedia(creator.id);
            const recentMedia = mediaResponse.data
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, 3); // Get 3 most recent posts per creator

            recentMedia.forEach(media => {
              feedData.push({
                id: `${creator.id}-${media.id}`,
                creator,
                media,
                isSubscribed: true,
              });
            });
          } catch (error) {
            console.error(`Error fetching media for creator ${creator.id}:`, error);
          }
        }

        // Sort feed by creation date
        feedData.sort((a, b) => new Date(b.media.createdAt).getTime() - new Date(a.media.createdAt).getTime());
        setFeedPosts(feedData);

      } catch (error) {
        console.error('Error fetching feed data:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load your personalized feed.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchFeedData();
    }
  }, [user, subscriptions, toast]);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="container py-8 space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        
        <Tabs defaultValue="feed" className="space-y-6">
          <TabsList>
            <TabsTrigger value="feed">Your Feed</TabsTrigger>
            <TabsTrigger value="discover">Discover</TabsTrigger>
          </TabsList>
          
          <TabsContent value="feed" className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center space-y-0 pb-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="ml-4 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="aspect-square w-full rounded-lg" />
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Welcome back, {user?.firstName}!</h1>
        <p className="text-muted-foreground">
          Here's what's new from your subscribed creators and popular content
        </p>
      </div>

      <Tabs defaultValue="feed" className="space-y-6">
        <TabsList>
          <TabsTrigger value="feed">Your Feed ({feedPosts.length})</TabsTrigger>
          <TabsTrigger value="discover">Discover Popular</TabsTrigger>
        </TabsList>
        
        <TabsContent value="feed" className="space-y-6">
          {feedPosts.length > 0 ? (
            <div className="space-y-6">
              {feedPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden">
                  <CardHeader className="flex flex-row items-center space-y-0 pb-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={post.creator.profilePicture} alt={post.creator.firstName} />
                      <AvatarFallback>{post.creator.firstName.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4 flex-1">
                      <Link 
                        to={`/creator/${post.creator.id}`}
                        className="font-semibold hover:text-primary transition-colors"
                      >
                        {post.creator.firstName}
                      </Link>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ClockIcon className="h-3 w-3" />
                        <span>{formatTimeAgo(post.media.createdAt)}</span>
                        {!post.media.isPublic && (
                          <Badge variant="secondary" className="text-xs">Premium</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">{post.media.title}</h3>
                      {post.media.description && (
                        <p className="text-muted-foreground text-sm">{post.media.description}</p>
                      )}
                    </div>
                    
                    <div className="relative aspect-square rounded-lg overflow-hidden">
                      {post.media.type === 'video' ? (
                        <video
                          src={post.media.url}
                          poster={post.media.thumbnailUrl}
                          controls
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={post.media.url}
                          alt={post.media.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-red-500">
                          <HeartIcon className="h-4 w-4 mr-1" />
                          <span className="text-sm">Like</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground">
                          <MessageCircleIcon className="h-4 w-4 mr-1" />
                          <span className="text-sm">Comment</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground">
                          <ShareIcon className="h-4 w-4 mr-1" />
                          <span className="text-sm">Share</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <h3 className="text-xl font-semibold mb-2">No posts in your feed</h3>
                <p className="text-muted-foreground mb-6">
                  Subscribe to creators to see their latest content here
                </p>
                <Button asChild>
                  <Link to="/discover">Discover Creators</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="discover" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Popular Creators</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularCreators.map((creator) => (
                <Card key={creator.id} className="overflow-hidden">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={creator.profilePicture} alt={creator.firstName} />
                        <AvatarFallback>{creator.firstName.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg">{creator.firstName}</h3>
                        <p className="text-muted-foreground text-sm">
                          {creator.subscribersCount} subscribers
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="secondary">
                          ${creator.subscriptionPrice}/month
                        </Badge>
                        <Badge variant="outline">
                          {creator.mediaCount} photos
                        </Badge>
                        {isSubscribedTo(creator.id) && (
                          <Badge className="bg-primary">Subscribed</Badge>
                        )}
                      </div>
                      <Button asChild className="w-full">
                        <Link to={`/creator/${creator.id}`}>View Profile</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button variant="outline" asChild>
                <Link to="/discover">View All Creators</Link>
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PersonalizedFeed;